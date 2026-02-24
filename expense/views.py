from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Q, Count, Sum 
from rest_framework.exceptions import ValidationError 
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db.models.functions import TruncMonth
import openpyxl
from django.http import HttpResponse
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

# Import local modules
from .utils import send_status_update_email, send_password_reset_email
from .models import Expense, ApprovalLog, Category, RolePermission, Permission
from .permissions import IsManager, IsFinance
from .serializers import (
    UserRegistrationSerializer, ExpenseSerializer, CategorySerializer,
    CustomTokenObtainPairSerializer, UserProfileSerializer,
    ChangeUsernameSerializer, ChangeProfilePicSerializer,
    ChangePasswordSerializer, ExpenseActionSerializer,
    PasswordResetRequestSerializer, SetNewPasswordSerializer        
)

User = get_user_model()

# ==========================
# 1. Authentication Views
# ==========================

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

# ==========================
# 2. Expense Management
# ==========================

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class MyExpenseListView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category']
    search_fields = ['description', 'amount']
    ordering_fields = ['created_at', 'amount']

    def get_queryset(self):
        return Expense.objects.filter(employee=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)

class MyExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(employee=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.status != 'Pending':
            raise ValidationError({"error": "You cannot edit an expense that has already been processed."})
        serializer.save()

    def perform_destroy(self, instance):
        if instance.status != 'Pending':
            raise ValidationError({"error": "You cannot delete an expense that has already been processed."})
        instance.delete()

# ==========================
# 3. Manager & Finance Logic (FIXED VISIBILITY)
# ==========================

class TeamExpenseListView(generics.ListAPIView):
    """
    GET: List expenses for the Manager's department.
    """
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated, IsManager]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['description', 'employee__username']

    def get_queryset(self):
        # 👇 FIX: Filter by department to ensure Manager sees their team
        user = self.request.user
        return Expense.objects.filter(
            employee__department=user.department
        ).exclude(employee=user).order_by('-created_at')

class FinanceQueueView(generics.ListAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated, IsFinance]
    
    def get_queryset(self):
        return Expense.objects.filter(status='Approved').order_by('created_at')

class ApproveRejectView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            expense = Expense.objects.get(pk=pk)
        except Expense.DoesNotExist:
            return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ExpenseActionSerializer(data=request.data)
        if serializer.is_valid():
            action = serializer.validated_data['action']
            remarks = serializer.validated_data.get('remarks', '')
            user_role = request.user.role.name if request.user.role else ""

            if action in ['Approved', 'Rejected']:
                if expense.status != 'Pending':
                    return Response({"error": "Already processed"}, status=400)
                if user_role != 'Manager': 
                    return Response({"error": "Only Managers can approve"}, status=403)

            elif action == 'Reimbursed':
                if expense.status != 'Approved':
                    return Response({"error": "Must be approved first"}, status=400)
                if user_role != 'Finance':
                    return Response({"error": "Only Finance can reimburse"}, status=403)

            expense.status = action
            expense.save()
        
            ApprovalLog.objects.create(
                expense=expense, reviewer=request.user,
                new_status=action, remarks=remarks
            )
            try:
                send_status_update_email(expense)
            except:
                pass
            return Response({"message": f"Expense marked as {action}", "status": action})
        return Response(serializer.errors, status=400)

# ==========================
# 4. Dashboards (FIXED STATS)
# ==========================

class EmployeeDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = Expense.objects.filter(employee=request.user)
        stats = queryset.aggregate(
            total_pending=Count('id', filter=Q(status='Pending')),
            total_approved=Count('id', filter=Q(status__in=['Approved', 'Reimbursed'])),
            total_rejected=Count('id', filter=Q(status='Rejected')),
            total_amount_claimed=Sum('amount', filter=Q(status='Reimbursed'))
        )
        stats['total_amount_claimed'] = stats['total_amount_claimed'] or 0
        return Response(stats)

class ManagerDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsManager]

    def get(self, request):
        # 👇 FIX: Stats based on Department
        team_expenses = Expense.objects.filter(
            employee__department=request.user.department
        ).exclude(employee=request.user)

        stats = team_expenses.aggregate(
            pending_approvals=Count('id', filter=Q(status='Pending')),
            total_approved=Count('id', filter=Q(status__in=['Approved', 'Reimbursed'])),
            total_rejected=Count('id', filter=Q(status='Rejected')),
            department_spend=Sum('amount', filter=Q(status='Reimbursed'))
        )
        stats['department_spend'] = stats['department_spend'] or 0
        return Response(stats)

class FinanceDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsFinance]

    def get(self, request):
        # Summary for Finance Cards
        all_expenses = Expense.objects.all()
        stats = {
            "pending_payment": all_expenses.filter(status='Approved').count(),
            "total_paid": all_expenses.filter(status='Reimbursed').count(),
            "total_payout": all_expenses.filter(status='Reimbursed').aggregate(Sum('amount'))['amount__sum'] or 0
        }
        return Response(stats)

# ==========================
# 5. Profile, Password Reset & Export
# ==========================

class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser] 
    def get_object(self): return self.request.user

class ChangeUsernameView(generics.UpdateAPIView):
    serializer_class = ChangeUsernameSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self): return self.request.user

class ChangeProfilePicView(generics.UpdateAPIView):
    serializer_class = ChangeProfilePicSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self): return self.request.user

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self): return self.request.user
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password updated"}, status=200)
        return Response(serializer.errors, status=400)

class ExportExpensesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsFinance]
    def get(self, request):
        status_filter = request.query_params.get('status')
        queryset = Expense.objects.all().order_by('-created_at')
        if status_filter: queryset = queryset.filter(status=status_filter)
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.append(["ID", "Employee", "Category", "Amount", "Status", "Date"])
        for exp in queryset:
            ws.append([exp.id, exp.employee.username, exp.category.name, exp.amount, exp.status, exp.created_at.replace(tzinfo=None)])
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="expenses.xlsx"'
        wb.save(response)
        return response

class RequestPasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            email = request.data['email']
            user = User.objects.filter(email=email).first()
            if user: send_password_reset_email(user)
            return Response({'message': 'Reset link sent if account exists'}, status=200)
        return Response(serializer.errors, status=400)

class PasswordTokenCheckView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, uidb64, token):
        try:
            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'error': 'Invalid token'}, status=400)
            return Response({'success': True}, status=200)
        except:
            return Response({'error': 'Invalid token'}, status=400)

class SetNewPasswordView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    permission_classes = [permissions.AllowAny]
    def patch(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Success'}, status=200)

class DeleteUserView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance == request.user: return Response({"error": "Cannot delete self"}, status=400)
        instance.is_active = False 
        instance.save()
        return Response({"message": "User deactivated"}, status=200)