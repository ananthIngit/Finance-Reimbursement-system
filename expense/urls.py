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
    RequestOTPView,
    ResetPasswordWithOTPView,
    # ADMIN VIEWS
    AdminUserListView,
    AdminUserDetailView,
    AdminDropdownDataView,
    AdminStatsView,
    VerifyOTPView,
    # NOTIFICATION VIEWS
    NotificationListView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView
)

urlpatterns = [
    # ==========================
    # 1. Authentication
    # ==========================
    path('register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomLoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # OTP PASSWORD RESET ROUTES
    path('auth/request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/reset-password-otp/', ResetPasswordWithOTPView.as_view(), name='reset-password-otp'),

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
    # 7. Admin Actions (Delete Self/Basic)
    # ==========================
    path('users/delete/<int:pk>/', DeleteUserView.as_view(), name='delete-user'),

    # ==========================
    # 8. Admin Management (Superuser/IT Dashboard)
    # ==========================
    path('admin-api/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin-api/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin-api/dropdowns/', AdminDropdownDataView.as_view(), name='admin-dropdowns'),
    path('admin-api/stats/', AdminStatsView.as_view(), name='admin-stats'),

    # ==========================
    # 9. Notifications
    # ==========================
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
    
    # 🛠️ FIXED: Changed 'read-all/' to 'mark-all-read/' to match Frontend Axios call
    path('notifications/mark-all-read/', MarkAllNotificationsReadView.as_view(), name='mark-all-notifications-read'),
]