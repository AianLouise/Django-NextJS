from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, UserDetailView, 
    ChangePasswordView, UpdateProfileView, OrganizationRegisterView,
    TeamMemberInviteView, AcceptInvitationView, OrganizationTeamView
)

urlpatterns = [
    # Organization-based registration (new primary flow)
    path('organization/register/', OrganizationRegisterView.as_view(), name='organization-register'),
    path('organization/invite/', TeamMemberInviteView.as_view(), name='invite-team-member'),
    path('organization/team/', OrganizationTeamView.as_view(), name='organization-team'),
    path('invitation/accept/', AcceptInvitationView.as_view(), name='accept-invitation'),
    
    # Individual registration (backwards compatibility)
    path('register/', RegisterView.as_view(), name='register'),
    
    # Authentication and profile management
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserDetailView.as_view(), name='user-detail'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('update-profile/', UpdateProfileView.as_view(), name='update-profile'),
]
