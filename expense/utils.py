from django.core.mail import send_mail
from django.conf import settings

# 👇 IMPORTS FOR PASSWORD RESET
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

# 👇 CRITICAL IMPORT: Use our Custom Generator (Stable Hash)
from .tokens import account_activation_token 

def send_status_update_email(expense):
    """
    Sends an email to the employee when their expense status changes.
    """
    subject = f"Expense Update: {expense.description[:20]}..."
    
    if expense.status == 'Approved':
        message = (
            f"Hi {expense.employee.first_name},\n\n"
            f"Good news! Your expense request for '{expense.description}' (${expense.amount}) has been APPROVED by your manager.\n\n"
            f"It is now sent to Finance for reimbursement.\n\n"
            f"Cheers,\nExpense Team"
        )
    elif expense.status == 'Rejected':
        message = (
            f"Hi {expense.employee.first_name},\n\n"
            f"Your expense request for '{expense.description}' was REJECTED.\n\n"
            f"Reason: See portal for remarks.\n\n"
            f"Please contact your manager for details.\n\n"
            f"Cheers,\nExpense Team"
        )
    elif expense.status == 'Reimbursed':
        message = (
            f"Hi {expense.employee.first_name},\n\n"
            f"Payment Processed! Your expense of ${expense.amount} has been REIMBURSED.\n"
            f"The funds should appear in your account shortly.\n\n"
            f"Cheers,\nFinance Team"
        )
    else:
        return 

    print(f"📨 Sending email to {expense.employee.email}...") 
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [expense.employee.email], 
        fail_silently=False,
    )


# 👇 UPDATED FUNCTION: Sends the Password Reset Link
def send_password_reset_email(user):
    """
    Generates a secure token link and sends it to the user's email.
    """
    # 1. Generate unique encoded ID
    uidb64 = urlsafe_base64_encode(force_bytes(user.id))
    
    # 2. Generate Token using OUR CUSTOM GENERATOR (Stable Hash)
    token = account_activation_token.make_token(user)
    
    # 3. Construct the Frontend URL 
    link = f"http://localhost:5173/reset-password/{uidb64}/{token}"
    
    # 👇 CLEANER CONSOLE OUTPUT (Prevents copy-paste errors)
    print("\n" + "="*60)
    print(f"🔐 PASSWORD RESET LINK FOR {user.username}")
    print("(Copy the line below carefully without spaces):")
    print("")
    print(link)
    print("")
    print("="*60 + "\n")
    
    subject = "Reset Your Password - ExpenseManager"
    message = f"""
    Hi {user.username},

    You requested to reset your password. Click the link below to set a new password:

    {link}

    If you didn't ask for this, please ignore this email.
    
    Cheers,
    ExpenseManager Security Team
    """
    
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER, # Sender
        [user.email], # Recipient
        fail_silently=False,
    )