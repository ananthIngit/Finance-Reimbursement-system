from rest_framework import permissions

class IsManager(permissions.BasePermission):
    """
    Allows access only to users with the 'Manager' role.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role and request.user.role.name == 'Manager'

class IsFinance(permissions.BasePermission):
    """
    Allows access only to users with the 'Finance' role.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role and request.user.role.name == 'Finance'

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        
        return obj.employee == request.user