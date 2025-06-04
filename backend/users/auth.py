# Custom authentication backend for using email as the username field
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Authentication backend which allows users to authenticate using either their
    username or email address
    """
    def authenticate(self, request, username=None, password=None, email=None, **kwargs):
        UserModel = get_user_model()
        
        # If email is explicitly provided, use it
        if email:
            kwargs = {'email': email}
        # If username looks like an email, try to authenticate with email
        elif username and '@' in username:
            kwargs = {'email': username}
        # Otherwise try to authenticate with username
        else:
            kwargs = {'username': username}
            
        try:
            user = UserModel.objects.get(**kwargs)
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            return None

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
