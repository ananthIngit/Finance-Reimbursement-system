from django.urls import path
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
    FinanceQueueView,   
    MyProfileView,
    ExportExpensesView 
)

urlpatterns = [
    # 1. Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomLoginView.as_view(), name='login'),

    # 2. General
    path('categories/', CategoryListView.as_view(), name='category-list'),

    # 3. Employee
    path('expenses/my/', MyExpenseListView.as_view(), name='my-expenses'),
    path('expenses/my/<int:pk>/', MyExpenseDetailView.as_view(), name='my-expense-detail'),

    # 4. Manager
    path('expenses/team/', TeamExpenseListView.as_view(), name='team-expenses'),
    path('expenses/approve/<int:pk>/', ApproveRejectView.as_view(), name='approve-reject'),

    # 5. Finance
    path('expenses/finance-queue/', FinanceQueueView.as_view(), name='finance-queue'),

    # 6. Profile
    path('profile/', MyProfileView.as_view(), name='my-profile'),
    path('profile/update-username/', ChangeUsernameView.as_view(), name='update-username'),
    path('profile/update-picture/', ChangeProfilePicView.as_view(), name='update-picture'),
    path('profile/change-password/', ChangePasswordView.as_view(), name='change-password'), 

    # 7. Admin
    path('users/delete/<int:pk>/', DeleteUserView.as_view(), name='delete-user'),

    # 8. Dashboards
    path('dashboard/employee/', EmployeeDashboardView.as_view(), name='dashboard-employee'),
    path('dashboard/manager/', ManagerDashboardView.as_view(), name='dashboard-manager'),
    path('dashboard/finance/', FinanceDashboardView.as_view(), name='dashboard-finance'),

    # 9. EXPORT (The new one)
    path('export/excel/', ExportExpensesView.as_view(), name='export-excel'),

    path('expenses/finance/queue/', FinanceQueueView.as_view(), name='finance-queue'),


    path('users/profile/', MyProfileView.as_view(), name='my-profile'),
    path('expenses/export/', ExportExpensesView.as_view(), name='export-expenses'),
]