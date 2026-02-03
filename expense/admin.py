from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Role, Permission, RolePermission, Category, User, Expense, ApprovalLog


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'is_active')
    search_fields = ('name',)

@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'is_active')
    search_fields = ('name', 'slug')

@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ('role', 'permission')
    list_filter = ('role',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_active')
    list_filter = ('is_active',)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    
    list_display = ('username', 'email', 'role', 'department', 'manager', 'is_active')
    list_filter = ('role', 'department', 'is_active')
    
    
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'manager', 'department', 'profile_pic')}),
    )


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'employee', 'category', 'amount', 'status', 'created_at')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('employee__username', 'description')

@admin.register(ApprovalLog)
class ApprovalLogAdmin(admin.ModelAdmin):
    list_display = ('expense', 'reviewer', 'new_status', 'action_date')
    list_filter = ('new_status', 'action_date')