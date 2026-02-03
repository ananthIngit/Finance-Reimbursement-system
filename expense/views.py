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

from .utils import send_status_update_email

import openpyxl
from django.http import HttpResponse

from .models import (
    Expense, 
    ApprovalLog, 
    Category, 
    RolePermission, 
    Permission
)
from .permissions import IsManager, IsFinance
from .serializers import (
    UserRegistrationSerializer, 
    ExpenseSerializer, 
    CategorySerializer,
    CustomTokenObtainPairSerializer,
    UserProfileSerializer,
    ChangeUsernameSerializer,   
    ChangeProfilePicSerializer,
    ChangePasswordSerializer,
    ExpenseActionSerializer  
)

User = get_user_model()


class CustomLoginView(TokenObtainPairView):
    """
    POST: Login with username/password.
    Returns: Access Token, Refresh Token, User ID, Role.
    """
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView): 
    """
    Endpoint for new users to register.
    Permission: AllowAny (Public)
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class CategoryListView(generics.ListAPIView):
    """
    Helper endpoint to get list of categories (for dropdowns).
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class MyExpenseListView(generics.ListCreateAPIView):
    """
    GET: List ONLY my own expenses.
    POST: Submit a new expense.
    """
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
    """ 
    GET: View details.
    PUT/DELETE: Only if Pending.
    """
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(employee=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.status != 'Pending':
            raise ValidationError(
                {"error": "You cannot edit an expense that has already been processed."}
            )
        serializer.save()

    def perform_destroy(self, instance):
        instance = self.get_object() # Safety check to ensure we get the object first
        if instance.status != 'Pending':
            raise ValidationError(
                {"error": "You cannot delete an expense that has already been processed."}
            )
        instance.delete()


class TeamExpenseListView(generics.ListAPIView):
    """
    GET: List expenses of users who report to ME (the Manager).
    """
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated, IsManager]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'employee'] 
    search_fields = ['description', 'employee__username']

    def get_queryset(self):
        return Expense.objects.filter(employee__manager=self.request.user).order_by('-created_at')


class FinanceQueueView(generics.ListAPIView):
    """
    Dashboard for Finance.
    GET: List ALL expenses that are 'Approved' and waiting for Reimbursement.
    """
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated, IsFinance]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'employee'] 
    search_fields = ['description', 'employee__username']

    def get_queryset(self):
        return Expense.objects.filter(status='Approved').order_by('created_at')


class ApproveRejectView(views.APIView):
    """
    POST: Change status of an expense.
    - Managers: Pending -> Approved / Rejected
    - Finance: Approved -> Reimbursed
    - TRIGGERS EMAIL NOTIFICATION ON SAVE
    """
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
                    return Response(
                        {"error": f"Cannot {action} this expense. Current status is {expense.status}."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if user_role != 'Manager': 
                    return Response(
                        {"error": "Access Denied: Only Managers can Approve/Reject."}, 
                        status=status.HTTP_403_FORBIDDEN
                    )

            elif action == 'Reimbursed':
                if expense.status != 'Approved':
                    return Response(
                        {"error": "Cannot Reimburse. Expense must be 'Approved' first."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if user_role != 'Finance':
                    return Response(
                        {"error": "Access Denied: Only Finance can Reimburse."}, 
                        status=status.HTTP_403_FORBIDDEN
                    )

            
            expense.status = action
            expense.save()
        
            ApprovalLog.objects.create(
                expense=expense,
                reviewer=request.user,
                new_status=action,
                remarks=remarks
            )

          
            try:
                send_status_update_email(expense)
            except Exception as e:
                
                print(f"⚠️ Email failed to send: {e}")

            return Response({"message": f"Expense marked as {action}", "status": action})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyProfileView(generics.RetrieveUpdateAPIView):    
    """
    GET: View own profile.
    PUT/PATCH: Update own profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
    parser_classes = [MultiPartParser, FormParser, JSONParser] 

    def get_object(self):
        return self.request.user


class ChangeUsernameView(generics.UpdateAPIView):
    serializer_class = ChangeUsernameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangeProfilePicView(generics.UpdateAPIView):
    serializer_class = ChangeProfilePicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteUserView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            target_perm = Permission.objects.get(slug='delete_user')
        except Permission.DoesNotExist:
            return Response(
                {"error": "System Error: Permission 'delete_user' not found."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        has_access = RolePermission.objects.filter(
            role=request.user.role,
            permission=target_perm
        ).exists()

        if not has_access:
            return Response(
                {"error": "Access Denied: You do not have permission to delete users."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        instance = self.get_object()

        if instance == request.user:
            return Response(
                {"error": "You cannot deactivate your own account."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        instance.is_active = False 
        instance.save()

        return Response(
            {"message": f"User '{instance.username}' has been deactivated successfully."}, 
            status=status.HTTP_200_OK
        )


class EmployeeDashboardView(views.APIView):
    """
    GET: Returns stats for the logged-in employee.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        
        queryset = Expense.objects.filter(employee=request.user)
        
        stats = queryset.aggregate(
            total_pending=Count('id', filter=Q(status='Pending')),
            
            total_approved=Count('id', filter=Q(status__in=['Approved', 'Reimbursed'])),
            
            total_rejected=Count('id', filter=Q(status='Rejected')),
            total_reimbursed=Count('id', filter=Q(status='Reimbursed')),
            
            total_amount_claimed=Sum('amount', filter=~Q(status='Rejected'))
        )

        if stats['total_amount_claimed'] is None:
            stats['total_amount_claimed'] = 0

        return Response(stats)


class ManagerDashboardView(views.APIView):
    """
    GET: Returns stats for a Manager's team.
    """
    permission_classes = [permissions.IsAuthenticated, IsManager]

    def get(self, request):
        # 1. Get all expenses for this manager's team
        team_expenses = Expense.objects.filter(employee__manager=request.user)

        # 2. Calculate Stats
        stats = team_expenses.aggregate(
            # Frontend expects 'pending_approvals', so we name it that (was pending_reviews)
            pending_approvals=Count('id', filter=Q(status='Pending')),
            
            # Count Approved AND Reimbursed as "Team Approved"
            total_approved=Count('id', filter=Q(status__in=['Approved', 'Reimbursed'])),
            
            total_rejected=Count('id', filter=Q(status='Rejected')),
            
            # Frontend expects 'department_spend', so we name it that (was total_team_spending)
            # LOGIC CHANGE: Only sum 'Reimbursed' items as per your request
            department_spend=Sum('amount', filter=Q(status='Reimbursed'))
        )
        
        # 3. Handle NULL values (if no expenses exist, return 0 instead of None)
        if stats['department_spend'] is None:
            stats['department_spend'] = 0

        return Response(stats)


class FinanceDashboardView(views.APIView):
    """
    GET: Returns stats for the Finance Department.
    - pending_reimbursements: Total amount waiting to be paid (Status='Approved').
    - monthly_reimbursement_totals: List of totals reimbursed per month.
    """
    permission_classes = [permissions.IsAuthenticated, IsFinance]

    def get(self, request):
      
        pending_stats = Expense.objects.filter(status='Approved').aggregate(
            total_amount=Sum('amount')
        )
        pending_amount = pending_stats['total_amount'] or 0

        
        monthly_stats = (
            Expense.objects.filter(status='Reimbursed')
            .annotate(month=TruncMonth('created_at'))  
            .values('month')                           
            .annotate(total_amount=Sum('amount'))      
            .order_by('-month')                        
        )

        return Response({
            "pending_reimbursements": pending_amount,
            "monthly_reimbursement_totals": list(monthly_stats)
        })


class ExportExpensesView(views.APIView):
    """
    GET: Downloads an Excel file (.xlsx) of all expenses.
    Query Params: ?status=Approved (optional filter)
    """
    permission_classes = [permissions.IsAuthenticated, IsFinance]

    def get(self, request):
        
        status_filter = request.query_params.get('status')
        queryset = Expense.objects.all().order_by('-created_at')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Expense Report"

        
        headers = ["ID", "Employee", "Category", "Amount", "Status", "Date", "Description"]
        ws.append(headers)

        
        for exp in queryset:
            
            date_str = exp.created_at.replace(tzinfo=None) 
            
            ws.append([
                exp.id,
                exp.employee.username,
                exp.category.name,
                exp.amount,
                exp.status,
                date_str,
                exp.description
            ])

        
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="expenses.xlsx"'
        
        wb.save(response)
        return response