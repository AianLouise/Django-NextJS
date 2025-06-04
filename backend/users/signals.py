from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from rest_framework.authtoken.models import Token
from .models import CustomUser, UserProfile

@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a user profile when a new user is created"""
    if created:
        UserProfile.objects.create(user=instance)
        
@receiver(post_save, sender=CustomUser)
def save_user_profile(sender, instance, **kwargs):
    """Save the user profile when the user is saved"""
    instance.profile.save()

@receiver(post_save, sender=CustomUser)
def create_auth_token(sender, instance, created, **kwargs):
    """Create an auth token for the user when they are created"""
    if created:
        Token.objects.create(user=instance)
