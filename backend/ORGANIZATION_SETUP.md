# Organization-Based User Registration System

## Overview

The user registration system has been updated to support organization-based account creation. The new system allows users to:

1. **Create an organization account** - Sign up as an organization owner
2. **Invite team members** - Add team members to your organization
3. **Manage team roles** - Assign different roles to team members

## Sign Up Flow

### "Create an account for your organization and add your team members"

The new primary registration flow is organization-centric:

1. **Organization Registration** (`POST /api/users/organization/register/`)
   - Creates a new organization
   - Creates the first user as the organization owner
   - Returns user details, organization info, and authentication token

2. **Team Member Invitation** (`POST /api/users/organization/invite/`)
   - Allows owners and admins to invite team members
   - Creates inactive user accounts with invitation tokens
   - Sends invitation details (in production, this would trigger email notifications)

3. **Accept Invitation** (`POST /api/users/invitation/accept/`)
   - Allows invited users to complete their account setup
   - Activates the user account and sets up authentication

## API Endpoints

### Organization Registration
```
POST /api/users/organization/register/
```

**Request Body:**
```json
{
  "organization_name": "Acme Corp",
  "organization_description": "A leading technology company",
  "email": "owner@acmecorp.com",
  "username": "acme_owner",
  "password": "securepassword123",
  "password2": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "owner@acmecorp.com",
    "username": "acme_owner",
    "first_name": "John",
    "last_name": "Doe",
    "role": "owner",
    "organization": {
      "id": "uuid-here",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "description": "A leading technology company",
      "user_count": 1,
      "max_users": 50
    }
  },
  "token": "auth-token-here",
  "message": "Organization created successfully! You can now invite team members."
}
```

### Invite Team Members
```
POST /api/users/organization/invite/
```

**Request Body:**
```json
{
  "email": "employee@acmecorp.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "employee",
  "job_title": "Software Developer",
  "department": "Engineering"
}
```

**Response:**
```json
{
  "message": "Team member invited successfully!",
  "invited_user": {
    "email": "employee@acmecorp.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "role": "employee",
    "invitation_token": "uuid-invitation-token"
  }
}
```

### Accept Invitation
```
POST /api/users/invitation/accept/
```

**Request Body:**
```json
{
  "token": "uuid-invitation-token",
  "username": "jane_smith",
  "password": "userpassword123",
  "password2": "userpassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": 2,
    "email": "employee@acmecorp.com",
    "username": "jane_smith",
    "first_name": "Jane",
    "last_name": "Smith",
    "role": "employee",
    "organization": {
      "id": "uuid-here",
      "name": "Acme Corp",
      "slug": "acme-corp"
    }
  },
  "token": "auth-token-here",
  "message": "Welcome to the team! Your account has been activated."
}
```

### View Organization Team
```
GET /api/users/organization/team/
```

**Response:**
```json
{
  "organization": {
    "id": "uuid-here",
    "name": "Acme Corp",
    "user_count": 2,
    "max_users": 50
  },
  "active_members": [
    {
      "id": 1,
      "email": "owner@acmecorp.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "owner"
    },
    {
      "id": 2,
      "email": "employee@acmecorp.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "role": "employee"
    }
  ],
  "pending_invitations": []
}
```

## User Roles

The system supports four user roles within an organization:

- **Owner** - Full organization control, can invite/manage all users
- **Admin** - Can invite and manage team members
- **Manager** - Can manage employees in their department
- **Employee** - Standard user access

## Models

### Organization Model
- `name` - Organization name
- `slug` - URL-friendly identifier
- `description` - Organization description
- `max_users` - Maximum team size (default: 50)
- `is_active` - Organization status
- Contact information fields

### Updated CustomUser Model
- `organization` - Foreign key to Organization
- `role` - User role within organization
- `is_invited` - Whether user was invited
- `invitation_token` - UUID for invitation process
- `invited_by` - Who sent the invitation
- `invited_at` - When invitation was sent

## Backward Compatibility

The original individual registration endpoint is still available:
```
POST /api/users/register/
```

This creates users without an organization association for backward compatibility.

## Security Features

1. **Invitation-only team joining** - Users can only join organizations through invitations
2. **Role-based permissions** - Only owners and admins can invite team members
3. **Token-based invitations** - Secure UUID tokens for invitation acceptance
4. **Organization isolation** - Users can only see team members from their organization
5. **User limits** - Organizations have configurable maximum user limits

## Next Steps

In a production environment, you would typically:

1. **Email Integration** - Send invitation emails with links containing tokens
2. **Frontend Implementation** - Create UI for organization registration and team management
3. **Role Permissions** - Implement role-based access control throughout the application
4. **Organization Settings** - Add organization management features
5. **Billing Integration** - Connect user limits to subscription plans
