from django.core.mail import send_mail
from django.conf import settings

def send_status_update_email(expense):
    """
    Sends an email to the employee when their expense status changes.
    """
    subject = f"Expense Update: {expense.description[:20]}..."
    
    if expense.status == 'Approved':
        message = (
            f"Hi {expense.employee.first_name or expense.employee.username},\n\n"
            f"Good news! Your expense request for '{expense.description}' (${expense.amount}) has been APPROVED by your manager.\n\n"
            f"It is now sent to Finance for reimbursement.\n\n"
            f"Cheers,\nExpense Team"
        )
    elif expense.status == 'Rejected':
        message = (
            f"Hi {expense.employee.first_name or expense.employee.username},\n\n"
            f"Your expense request for '{expense.description}' was REJECTED.\n\n"
            f"Reason: See portal for remarks.\n\n"
            f"Please contact your manager for details.\n\n"
            f"Cheers,\nExpense Team"
        )
    elif expense.status == 'Reimbursed':
        message = (
            f"Hi {expense.employee.first_name or expense.employee.username},\n\n"
            f"Payment Processed! Your expense of ${expense.amount} has been REIMBURSED.\n"
            f"The funds should appear in your account shortly.\n\n"
            f"Cheers,\nFinance Team"
        )
    else:
        return 

    print(f"📨 Sending status update email to {expense.employee.email}...") 
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [expense.employee.email], 
        fail_silently=False,
    )


# 👇 UPDATED FUNCTION: Sends the 6-Digit OTP
def send_otp_email(user, otp):
    """
    Sends a 6-digit OTP to the user's email for password reset.
    """
    
    # 👇 CLEAN CONSOLE OUTPUT (Helpful for quick local testing!)
    print("\n" + "="*60)
    print(f"🔐 OTP FOR {user.username}: {otp}")
    print("="*60 + "\n")
    
    subject = "Your ExpenseManager Password Reset Code"
    
    message = f"""Hi {user.username},

We received a request to reset the password for your ExpenseManager account.

Your 6-digit reset code is: 
{otp}

This code will expire in exactly 10 minutes.

If you did not request a password reset, please ignore this email. Your account is safe.

Cheers,
ExpenseManager Security Team
"""
    
    # Using DEFAULT_FROM_EMAIL if you set it in settings.py, otherwise fallback to EMAIL_HOST_USER
    sender = getattr(settings, 'DEFAULT_FROM_EMAIL', settings.EMAIL_HOST_USER)

    send_mail(
        subject,
        message,
        sender, # Sender
        [user.email], # Recipient
        fail_silently=False,
    )