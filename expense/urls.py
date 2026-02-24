from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    CustomLoginView, 
    CategoryListView, 
    MyExpenseListView, 
    MyExpenseDetailView, 
    TeamExpenseListView, 
    FinanceQueueView,    
    ApproveRejectView,
    MyProfileView,
    ChangeUsernameView,   
    ChangeProfilePicView,
    ChangePasswordView, 
    DeleteUserView,
    EmployeeDashboardView,
    ManagerDashboardView,
    FinanceDashboardView,
    ExportExpensesView,
    RequestPasswordResetView,
    PasswordTokenCheckView,
    SetNewPasswordView
)

urlpatterns = [
    # ==========================
    # 1. Authentication
    # ==========================
    # Frontend calls axios.post('/api/register/')
    path('register/', RegisterView.as_view(), name='register'),
    
    # Frontend calls axios.post('/api/auth/login/')
    path('auth/login/', CustomLoginView.as_view(), name='login'),
    
    # Refresh token endpoint
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # PASSWORD RESET ROUTES
    path('password-reset/', RequestPasswordResetView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordTokenCheckView.as_view(), name='password-reset-confirm'),
    path('password-reset-complete/', SetNewPasswordView.as_view(), name='password-reset-complete'),

    # ==========================
    # 2. General / Helpers
    # ==========================
    path('categories/', CategoryListView.as_view(), name='category-list'),

    # ==========================
    # 3. Employee Actions
    # ==========================
    path('expenses/my/', MyExpenseListView.as_view(), name='my-expenses'),
    path('expenses/my/<int:pk>/', MyExpenseDetailView.as_view(), name='my-expense-detail'),
    path('dashboard/employee/', EmployeeDashboardView.as_view(), name='dashboard-employee'),

    # ==========================
    # 4. Manager Actions
    # ==========================
    path('expenses/team/', TeamExpenseListView.as_view(), name='team-expenses'),
    path('expenses/approve/<int:pk>/', ApproveRejectView.as_view(), name='approve-reject'),
    path('dashboard/manager/', ManagerDashboardView.as_view(), name='dashboard-manager'),

    # ==========================
    # 5. Finance Actions
    # ==========================
    path('expenses/finance/queue/', FinanceQueueView.as_view(), name='finance-queue'),
    path('dashboard/finance/', FinanceDashboardView.as_view(), name='dashboard-finance'),
    path('expenses/export/', ExportExpensesView.as_view(), name='export-expenses'),

    # ==========================
    # 6. Profile Management
    # ==========================
    path('users/profile/', MyProfileView.as_view(), name='my-profile'),
    path('profile/update-username/', ChangeUsernameView.as_view(), name='update-username'),
    path('profile/update-picture/', ChangeProfilePicView.as_view(), name='update-picture'),
    path('profile/change-password/', ChangePasswordView.as_view(), name='change-password'), 

    # ==========================
    # 7. Admin Actions
    # ==========================
    path('users/delete/<int:pk>/', DeleteUserView.as_view(), name='delete-user'),
]