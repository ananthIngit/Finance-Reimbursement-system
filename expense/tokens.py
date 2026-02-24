# expenses/tokens.py
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class CustomTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        # We strictly verify against the User ID, Timestamp, and Current Password.
        # We purposefully OMIT 'last_login' to prevent login events from breaking the link.
        return (
            str(user.pk) + 
            str(timestamp) + 
            str(user.password)
        )

# Instantiate it to use the exact same instance everywhere
account_activation_token = CustomTokenGenerator()