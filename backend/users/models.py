from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
import uuid

class Organization(models.Model):
    """
    Model for organizations/companies
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    
    # Organization settings
    is_active = models.BooleanField(default=True)
    max_users = models.PositiveIntegerField(default=50)  # Team size limit
    
    # Contact information
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    @property
    def user_count(self):
        """Get current number of users in the organization"""
        return self.users.count()
    
    def can_add_users(self):
        """Check if organization can add more users"""
        return self.user_count < self.max_users

class CustomUser(AbstractUser):
    """
    Custom user model to extend built-in Django user with additional fields
    """
    email = models.EmailField(_('email address'), unique=True)
    
    # Additional fields
    job_title = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    
    # Organization relationship
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.CASCADE, 
        related_name='users',
        null=True,
        blank=True
    )
    
    # Role within organization
    ROLE_CHOICES = (
        ('owner', 'Organization Owner'),
        ('admin', 'Administrator'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    
    # Invitation tracking
    is_invited = models.BooleanField(default=False)
    invitation_token = models.UUIDField(null=True, blank=True)
    invited_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invited_users'
    )
    invited_at = models.DateTimeField(null=True, blank=True)
    
    # Add any other fields you might need
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email

class UserProfile(models.Model):
    """
    Extended profile information for users
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    hire_date = models.DateField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.email}'s profile"
