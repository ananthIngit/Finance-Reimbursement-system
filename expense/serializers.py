import re   
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer   
from .models import Role, Category, Expense, ApprovalLog

User = get_user_model()

# ==========================
# 1. AUTHENTICATION & REGISTRATION
# ==========================

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customizes the JWT response to include User ID, Role, and Email.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_id'] = self.user.id
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['role'] = self.user.role.name if self.user.role else "No Role"
        return data

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) 

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'role', 'department', 'manager']

    def validate_first_name(self, value):
        if not re.match(r'^[a-zA-Z]+$', value):
            raise serializers.ValidationError("First name must contain only letters.")
        return value

    def validate_last_name(self, value):
        if not re.match(r'^[a-zA-Z]+$', value):
            raise serializers.ValidationError("Last name must contain only letters.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data) 
        user.set_password(password) 
        user.save()
        return user


# ==========================
# 2. PROFILE & SETTINGS
# ==========================

class UserSerializer(serializers.ModelSerializer):
    """
    Used for displaying user profile details in general lists.
    """
    role_name = serializers.ReadOnlyField(source='role.name')
    manager_name = serializers.ReadOnlyField(source='manager.username')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role_name', 'department', 'manager_name', 'profile_pic']

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Used for MyProfileView. Allows fetching and updating profile details.
    """
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.ImageField(source='profile_pic', required=False)

    role_name = serializers.ReadOnlyField(source='role.name')
    manager_name = serializers.ReadOnlyField(source='manager.username')
    department_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'profile_picture', 'department_name', 'role_name', 'manager_name'
        ]
        read_only_fields = ['id', 'username', 'email', 'department_name', 'role_name', 'manager_name']

    def get_department_name(self, obj):
        return str(obj.department) if obj.department else "General"

class ChangeUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']
    
    def validate_username(self, value):
        if not re.match(r'^[a-zA-Z0-9]+$', value):
            raise serializers.ValidationError("Username can only contain letters and numbers.")
        return value

class ChangeProfilePicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['profile_pic']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct.")
        return value

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("New password must be at least 8 characters long.")
        return value


# ==========================
# 3. EXPENSES & CATEGORIES
# ==========================

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'is_active']

class ExpenseSerializer(serializers.ModelSerializer):
    """
    Main serializer for List/Create/Update expenses.
    Handles receipt validation, amount checks, and read-only status.
    """
    employee_name = serializers.ReadOnlyField(source='employee.username')
    category_name = serializers.ReadOnlyField(source='category.name')
    status = serializers.ReadOnlyField() 

    class Meta:
        model = Expense
        fields = [
            'id', 'employee_name', 'category', 'category_name', 
            'amount', 'description', 'receipt', 'status', 'created_at'
        ]
        read_only_fields = ['status', 'created_at', 'employee'] 

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    def validate_description(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Description is too short (min 5 characters).")
        if "<script>" in value.lower():
            raise serializers.ValidationError("Invalid characters in description.")
        return value

    def validate_receipt(self, value):
        if not value:
            return value 
            
        valid_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
        import os
        ext = os.path.splitext(value.name)[1].lower()
        
        if ext not in valid_extensions:
            raise serializers.ValidationError("Unsupported file type. Please upload a PDF, JPG, or PNG.")
        
        limit_mb = 5
        if value.size > limit_mb * 1024 * 1024:
            raise serializers.ValidationError(f"File too large. Size should not exceed {limit_mb} MB.")
            
        return value

class ExpenseActionSerializer(serializers.Serializer):
    """
    Includes 'Reimbursed' in choices for Finance users.
    Ensures 'remarks' are present if rejected.
    """
    action = serializers.ChoiceField(choices=['Approved', 'Rejected', 'Reimbursed']) 
    remarks = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        action = data.get('action')
        remarks = data.get('remarks')

        if action == 'Rejected':
            if not remarks or not remarks.strip():
                raise serializers.ValidationError({
                    "remarks": "Remarks are mandatory when rejecting an expense."
                })
        return data

class ApprovalLogSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.ReadOnlyField(source='reviewer.username')

    class Meta:
        model = ApprovalLog
        fields = ['id', 'reviewer_name', 'new_status', 'remarks', 'action_date']


# ==========================
# 4. ADMIN DASHBOARD
# ==========================

class AdminUserListSerializer(serializers.ModelSerializer):
    """
    Formats user data for the main Admin table.
    """
    role_name = serializers.CharField(source='role.name', read_only=True)
    manager_name = serializers.CharField(source='manager.username', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'role_name', 'manager', 'manager_name', 
            'department', 'is_active', 'date_joined'
        ]

class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """
    Used when the Admin updates a user's role, manager, or status.
    """
    class Meta:
        model = User
        fields = ['role', 'manager', 'department', 'is_active']