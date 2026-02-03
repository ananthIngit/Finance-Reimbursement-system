import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from faker import Faker
from expense.models import Role, Category, Permission, RolePermission, Expense, ApprovalLog

User = get_user_model()
fake = Faker()

class Command(BaseCommand):
    help = 'Resets and populates the database with realistic demo data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("⚠️  Starting Full Database Reset..."))

        # 1. CLEANUP: Clear old data so we don't get duplicates or messy charts
        self.stdout.write("   - Deleting old Expenses & Logs...")
        ApprovalLog.objects.all().delete()
        Expense.objects.all().delete()
        
        self.stdout.write("   - Deleting non-superuser accounts...")
        User.objects.filter(is_superuser=False).delete()
        
        # Note: We keep Roles/Categories/Perms to avoid recreating them if they exist,
        # but the logic below uses get_or_create to be safe.

        # 2. SETUP: Create Roles
        self.stdout.write(self.style.SUCCESS("🌱 Creating Roles..."))
        roles = {}
        for role_name in ['Employee', 'Manager', 'Finance']:
            role, _ = Role.objects.get_or_create(name=role_name)
            roles[role_name] = role

        # 3. SETUP: Create Categories
        self.stdout.write(self.style.SUCCESS("🌱 Creating Categories..."))
        cats = []
        for cat_name in ['Travel', 'Food', 'Hardware', 'Software', 'Office Supplies']:
            cat, _ = Category.objects.get_or_create(name=cat_name)
            cats.append(cat)

        # 4. SETUP: Create Permissions
        self.stdout.write(self.style.SUCCESS("🌱 Creating Permissions..."))
        permissions_data = [
            {'slug': 'approve_expense', 'name': 'Can Approve Expense'},
            {'slug': 'delete_user', 'name': 'Can Delete User'}, 
        ]
        
        perms = {}
        for p in permissions_data:
            perm, _ = Permission.objects.get_or_create(slug=p['slug'], defaults={'name': p['name']})
            perms[p['slug']] = perm

        # 5. LINKING: Assign Permissions to Roles
        # Manager gets Approve + Delete User
        RolePermission.objects.get_or_create(role=roles['Manager'], permission=perms['approve_expense'])
        RolePermission.objects.get_or_create(role=roles['Manager'], permission=perms['delete_user'])
        
        # Finance gets Approve (CRITICAL FIX: Finance needs this to reimburse!)
        RolePermission.objects.get_or_create(role=roles['Finance'], permission=perms['approve_expense'])

        # 6. POPULATION: Create Users
        self.stdout.write(self.style.SUCCESS("👤 Creating Users..."))
        
        # Finance User
        finance_user = User.objects.create_user(
            username='David_Finance', email='david@company.com', password='Password@123',
            role=roles['Finance'], department='Accounts'
        )

        # Manager User
        manager_user = User.objects.create_user(
            username='Mike_Manager', email='mike@company.com', password='Password@123',
            role=roles['Manager'], department='Sales'
        )

        # 5 Employees (All reporting to Mike)
        employees = []
        for i in range(5):
            emp = User.objects.create_user(
                username=f'Employee_{i+1}', email=f'emp{i+1}@company.com', password='Password@123',
                role=roles['Employee'], department='Sales',
                manager=manager_user # <--- Links them to Mike automatically!
            )
            employees.append(emp)

        # 7. POPULATION: Generate 50 Random Expenses
        self.stdout.write(self.style.SUCCESS("💸 Generating 50 Realistic Expenses..."))
        
        status_choices = ['Pending', 'Approved', 'Rejected', 'Reimbursed']
        
        for _ in range(50):
            emp = random.choice(employees)
            status = random.choice(status_choices)
            
            # Create the expense
            # Random date in last 90 days (good for Monthly Charts)
            created_at = timezone.now() - timedelta(days=random.randint(0, 90))
            
            exp = Expense.objects.create(
                employee=emp,
                category=random.choice(cats),
                amount=round(random.uniform(50, 1500), 2),
                description=fake.bs(), # Generates "synergize scalable e-markets" etc.
                status=status,
            )
            # Hack to force the custom date (auto_now_add usually blocks this)
            exp.created_at = created_at
            exp.save()

            # Create an Approval Log if it's not Pending
            if status != 'Pending':
                reviewer = manager_user if status in ['Approved', 'Rejected'] else finance_user
                ApprovalLog.objects.create(
                    expense=exp,
                    reviewer=reviewer,
                    new_status=status,
                    remarks=fake.sentence(),
                    action_date=created_at + timedelta(hours=random.randint(1, 24))
                )

        self.stdout.write(self.style.SUCCESS("✅ DONE! Login as 'Mike_Manager' or 'David_Finance' (Password@123)"))