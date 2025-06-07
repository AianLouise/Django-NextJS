from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.text import slugify
from django.utils import timezone
import uuid
from .models import CustomUser, UserProfile, Organization

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_picture', 'bio', 'date_of_birth', 'hire_date']

class OrganizationSerializer(serializers.ModelSerializer):
    user_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'slug', 'description', 'address', 'phone', 
                  'website', 'user_count', 'max_users', 'created_at']
        read_only_fields = ['id', 'slug', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 
                  'job_title', 'department', 'phone_number', 'profile',
                  'organization', 'role']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'password2', 'first_name', 'last_name']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class OrganizationRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for creating an organization and the first admin user
    """
    # Organization fields
    organization_name = serializers.CharField(max_length=200)
    organization_description = serializers.CharField(required=False, allow_blank=True)
    
    # User fields  
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'password2', 'first_name', 'last_name',
                  'organization_name', 'organization_description']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Check if organization name is unique (slug)
        org_slug = slugify(attrs['organization_name'])
        if Organization.objects.filter(slug=org_slug).exists():
            raise serializers.ValidationError({
                "organization_name": "An organization with this name already exists."
            })
        
        return attrs
    
    def create(self, validated_data):
        # Extract organization data
        org_name = validated_data.pop('organization_name')
        org_description = validated_data.pop('organization_description', '')
        
        # Create organization
        organization = Organization.objects.create(
            name=org_name,
            slug=slugify(org_name),
            description=org_description
        )
        
        # Create the organization owner
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            organization=organization,
            role='owner'
        )
        
        return user

class TeamMemberInviteSerializer(serializers.Serializer):
    """
    Serializer for inviting team members to join an organization
    """
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES, default='employee')
    job_title = serializers.CharField(required=False, allow_blank=True, max_length=100)
    department = serializers.CharField(required=False, allow_blank=True, max_length=100)
    
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self, validated_data):
        # Get organization from context
        organization = self.context['organization']
        inviter = self.context['inviter']
        
        # Check if organization can add more users
        if not organization.can_add_users():
            raise serializers.ValidationError("Organization has reached maximum user limit.")
        
        # Create invited user
        invitation_token = uuid.uuid4()
        user = CustomUser.objects.create_user(
            username=validated_data['email'],  # Use email as username initially
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            job_title=validated_data.get('job_title', ''),
            department=validated_data.get('department', ''),
            organization=organization,
            role=validated_data['role'],
            is_invited=True,
            is_active=False,  # User is inactive until they accept invitation
            invitation_token=invitation_token,
            invited_by=inviter,
            invited_at=timezone.now()
        )
        
        # Set a temporary password - user will set their own when accepting invitation
        user.set_unusable_password()
        user.save()
        
        return user

class AcceptInvitationSerializer(serializers.Serializer):
    """
    Serializer for accepting team member invitations
    """
    token = serializers.UUIDField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    username = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Validate invitation token
        try:
            user = CustomUser.objects.get(
                invitation_token=attrs['token'],
                is_invited=True,
                is_active=False
            )
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"token": "Invalid or expired invitation token."})
        
        # Check if username is already taken
        if CustomUser.objects.filter(username=attrs['username']).exclude(id=user.id).exists():
            raise serializers.ValidationError({"username": "Username is already taken."})
        
        attrs['user'] = user
        return attrs
    
    def save(self):
        user = self.validated_data['user']
        
        # Update user with new credentials
        user.username = self.validated_data['username']
        user.set_password(self.validated_data['password'])
        user.is_active = True
        user.is_invited = False
        user.invitation_token = None
        user.save()
        
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)  # Can be email or username
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            # Try to authenticate with the custom backend that supports email or username
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            
            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Must include "email" and "password".'
            raise serializers.ValidationError(msg, code='authorization')
        
        attrs['user'] = user
        return attrs

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

class UpdateUserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'job_title', 'department', 'phone_number', 'profile']
        
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile
        
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.job_title = validated_data.get('job_title', instance.job_title)
        instance.department = validated_data.get('department', instance.department)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.save()
        
        profile.bio = profile_data.get('bio', profile.bio)
        profile.date_of_birth = profile_data.get('date_of_birth', profile.date_of_birth)
        profile.hire_date = profile_data.get('hire_date', profile.hire_date)
        
        if profile_data.get('profile_picture'):
            profile.profile_picture = profile_data.get('profile_picture')
        
        profile.save()
        
        return instance
