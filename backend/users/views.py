from django.contrib.auth import logout
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

from .models import CustomUser, Organization
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer, 
    ChangePasswordSerializer, UpdateUserSerializer,
    OrganizationRegisterSerializer, TeamMemberInviteSerializer,
    AcceptInvitationSerializer, OrganizationSerializer
)

class OrganizationRegisterView(APIView):
    """
    Create an account for your organization and become the organization creator
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = OrganizationRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'organization': OrganizationSerializer(user.organization).data,
                'token': token.key,
                'message': 'Organization created successfully! You can now invite team members.'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TeamMemberInviteView(APIView):
    """
    Invite team members to join your organization
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Only creators and admins can invite team members
        if request.user.role not in ['creator', 'admin']:
            return Response({
                'error': 'Only organization creators and administrators can invite team members.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if not request.user.organization:
            return Response({
                'error': 'User must belong to an organization to invite team members.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = TeamMemberInviteSerializer(
            data=request.data,
            context={
                'organization': request.user.organization,
                'inviter': request.user
            }
        )
        if serializer.is_valid():
            invited_user = serializer.save()
            
            # Send invitation email
            try:
                invitation_url = f"http://localhost:3000/accept-invitation?token={invited_user.invitation_token}"
                
                # Email content
                subject = f"You're invited to join {request.user.organization.name}"
                message = f"""
Hi {invited_user.first_name},

You've been invited by {request.user.get_full_name()} to join {request.user.organization.name} as a {invited_user.role}.

To accept this invitation and create your account, please click the link below:
{invitation_url}

This invitation will expire in 7 days.

Welcome to the team!

Best regards,
The {request.user.organization.name} Team
                """
                
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[invited_user.email],
                    fail_silently=False,
                )
                
                return Response({
                    'message': 'Team member invited successfully! An invitation email has been sent.',
                    'invited_user': {
                        'email': invited_user.email,
                        'first_name': invited_user.first_name,
                        'last_name': invited_user.last_name,
                        'role': invited_user.role,
                    }
                }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                # If email fails, still return success but mention email issue
                return Response({
                    'message': 'Team member invited successfully, but email could not be sent. Please share the invitation link manually.',
                    'invited_user': {
                        'email': invited_user.email,
                        'first_name': invited_user.first_name,
                        'last_name': invited_user.last_name,
                        'role': invited_user.role,
                        'invitation_token': str(invited_user.invitation_token)
                    },
                    'invitation_url': f"http://localhost:3000/accept-invitation?token={invited_user.invitation_token}"
                }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AcceptInvitationView(APIView):
    """
    Accept a team member invitation and complete account setup
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = AcceptInvitationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'organization': OrganizationSerializer(user.organization).data,
                'token': token.key,
                'message': 'Welcome to the team! Your account has been activated.'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrganizationTeamView(APIView):
    """
    View and manage organization team members
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.organization_id:
            return Response({
                'error': 'User must belong to an organization.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            organization = Organization.objects.get(pk=request.user.organization_id)
        except Organization.DoesNotExist:
            return Response({
                'error': 'Organization not found.'
            }, status=status.HTTP_400_BAD_REQUEST)

        team_members = CustomUser.objects.filter(
            organization=request.user.organization_id
        ).order_by('role', 'first_name', 'last_name')

        active_members = team_members.filter(is_active=True)
        pending_invitations = team_members.filter(is_active=False, is_invited=True)

        return Response({
            'organization': OrganizationSerializer(organization).data,
            'active_members': UserSerializer(active_members, many=True).data,
            'pending_invitations': [{
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'invited_at': user.invited_at,
                'invited_by': user.invited_by.get_full_name() if user.invited_by else None
            } for user in pending_invitations]
        })

# Keep existing individual registration for backwards compatibility
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Try to delete the token
        try:
            request.user.auth_token.delete()
        except (AttributeError, Token.DoesNotExist):
            pass
        
        # Django logout - clears session
        logout(request)
        
        return Response({
            "success": "Successfully logged out.",
            "status": "ok"
        }, status=status.HTTP_200_OK)

class UserDetailView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            # Check old password
            if not user.check_password(serializer.data.get('old_password')):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            user.set_password(serializer.data.get('new_password'))
            user.save()
            
            # Update token
            user.auth_token.delete()
            token = Token.objects.create(user=user)
            
            return Response({
                'status': 'success',
                'message': 'Password updated successfully',
                'token': token.key
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        user = request.user
        serializer = UpdateUserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(user).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
