from django.core.mail import send_mail
from django.conf import settings

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