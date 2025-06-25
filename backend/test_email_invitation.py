#!/usr/bin/env python3
"""
Test script for email invitation functionality
"""
import os
import sys
import django
import requests
import json

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import CustomUser, Organization

def test_email_invitation_flow():
    """Test the complete email invitation flow"""
    
    print("=== Testing Email Invitation Flow ===\n")
    
    # Base URL for API
    BASE_URL = 'http://127.0.0.1:8000'
    
    # 1. First, let's create a test organization creator
    print("1. Creating test organization and creator...")
    
    # Clear existing test data
    CustomUser.objects.filter(email__contains='test').delete()
    Organization.objects.filter(name__contains='Test').delete()
    # Create organization signup data
    signup_data = {
        'organization_name': 'Test Organization',
        'organization_description': 'A test organization for email invitations',
        'first_name': 'John',
        'last_name': 'Creator',
        'username': 'john.creator',
        'email': 'john.creator@testorg.com',
        'password': 'TestPassword123!',
        'password2': 'TestPassword123!',
        'role': 'creator'
    }# Create organization via API
    response = requests.post(f'{BASE_URL}/api/users/organization/register/', json=signup_data)
    
    if response.status_code == 201:
        print("✓ Organization and creator created successfully")
        auth_data = response.json()
        auth_token = auth_data.get('token')
        print(f"  - Organization: {auth_data.get('organization', {}).get('name')}")
        print(f"  - Creator: {auth_data.get('user', {}).get('first_name')} {auth_data.get('user', {}).get('last_name')}")
    else:
        print(f"✗ Failed to create organization: {response.status_code}")
        print(f"  Response: {response.text}")
        return False
    
    # 2. Test team invitation
    print("\n2. Testing team member invitation...")
    headers = {
        'Authorization': f'Token {auth_token}',
        'Content-Type': 'application/json'
    }
    
    invitation_data = {
        'email': 'jane.employee@testorg.com',
        'first_name': 'Jane',
        'last_name': 'Employee',
        'role': 'employee'
    }
    
    response = requests.post(f'{BASE_URL}/api/users/organization/invite/', 
                        json=invitation_data, headers=headers)
    
    if response.status_code == 201:
        print("✓ Team member invitation sent successfully")
        invite_response = response.json()
        print(f"  - Invited: {invite_response.get('first_name')} {invite_response.get('last_name')}")
        print(f"  - Email: {invite_response.get('email')}")
        print(f"  - Role: {invite_response.get('role')}")
    else:
        print(f"✗ Failed to send invitation: {response.status_code}")
        print(f"  Response: {response.text}")
        return False
    # 3. Check if invitation token was created
    print("\n3. Verifying invitation token...")
    
    try:
        invited_user = CustomUser.objects.get(email='jane.employee@testorg.com', is_invited=True)
        print("✓ Invitation token created successfully")
        print(f"  - Token: {invited_user.invitation_token}")
        print(f"  - Email: {invited_user.email}")
        print(f"  - Organization: {invited_user.organization.name}")
        # 4. Test invitation acceptance
        print("\n4. Testing invitation acceptance...")
        
        accept_data = {
            'token': str(invited_user.invitation_token),
            'username': 'jane.employee',
            'password': 'TestPassword123!',
            'password2': 'TestPassword123!'
        }
        
        response = requests.post(f'{BASE_URL}/api/users/invitation/accept/', json=accept_data)
        
        if response.status_code == 200:
            print("✓ Invitation accepted successfully")
            accept_response = response.json()
            print(f"  - User created: {accept_response.get('user', {}).get('first_name')} {accept_response.get('user', {}).get('last_name')}")
            print(f"  - Organization: {accept_response.get('organization', {}).get('name')}")
        else:
            print(f"✗ Failed to accept invitation: {response.status_code}")
            print(f"  Response: {response.text}")
            return False
            
    except CustomUser.DoesNotExist:
        print("✗ Invitation token not found")
        return False
    
    # 5. Test team data retrieval
    print("\n5. Testing team data retrieval...")
    
    response = requests.get(f'{BASE_URL}/api/users/organization/team/', headers=headers)
    
    if response.status_code == 200:
        print("✓ Team data retrieved successfully")
        team_data = response.json()
        
        print(f"  - Organization: {team_data.get('organization', {}).get('name')}")
        print(f"  - Active members: {len(team_data.get('active_members', []))}")
        print(f"  - Pending invitations: {len(team_data.get('pending_invitations', []))}")
        
        # Show active members
        for member in team_data.get('active_members', []):
            print(f"    - {member.get('first_name')} {member.get('last_name')} ({member.get('role')})")
            
    else:
        print(f"✗ Failed to retrieve team data: {response.status_code}")
        print(f"  Response: {response.text}")
        return False
    
    print("\n=== Email Invitation Flow Test Complete ===")
    print("✓ All tests passed! The email invitation system is working correctly.")
    return True

if __name__ == '__main__':
    success = test_email_invitation_flow()
    sys.exit(0 if success else 1)
