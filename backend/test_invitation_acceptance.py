#!/usr/bin/env python3
"""
Simple test script to verify invitation acceptance functionality
"""

import os
import sys
import django
import requests
from datetime import datetime

# Add the Django project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import Organization, CustomUser

def test_invitation_acceptance():
    """Test the complete invitation acceptance flow"""
    
    BASE_URL = 'http://localhost:8000/api'
    
    # Generate unique timestamp for this test run
    import time
    timestamp = str(int(time.time()))
    
    print("🚀 Testing Invitation Acceptance Flow")
    print("=" * 50)
    
    # Step 1: Create organization and invite a user
    print("\n1. Creating organization and sending invitation...")
    
    try:
        # Register organization
        org_data = {
            'organization_name': f'Test Accept Org {timestamp}',
            'username': f'testadmin{timestamp}',
            'email': f'admin{timestamp}@testaccept.com',
            'first_name': 'Test',
            'last_name': 'Admin',
            'password': 'TestPass123!',
            'password2': 'TestPass123!'
        }
        
        response = requests.post(f'{BASE_URL}/users/organization/register/', json=org_data)
        
        if response.status_code == 201:
            print("✅ Organization registered successfully")
            org_response = response.json()
            auth_token = org_response.get('token')
            print(f"   Admin token: {auth_token[:20]}...")
        else:
            print(f"❌ Organization registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server. Make sure it's running on http://localhost:8000")
        return False
    
    # Step 2: Send invitation
    print("\n2. Sending team invitation...")
    
    invite_data = {
        'email': f'newmember{timestamp}@testaccept.com',
        'first_name': 'New',
        'last_name': 'Member',
        'role': 'employee'
    }
    
    headers = {'Authorization': f'Token {auth_token}'}
    
    response = requests.post(f'{BASE_URL}/users/organization/invite/', 
                        json=invite_data, headers=headers)
    
    if response.status_code == 201:
        print("✅ Invitation sent successfully")
        
        # Get the invitation token from database
        try:
            invited_user = CustomUser.objects.filter(email=f'newmember{timestamp}@testaccept.com', is_invited=True).first()
            if invited_user and invited_user.invitation_token:
                invitation_token = str(invited_user.invitation_token)
                print(f"   Invitation token: {invitation_token}")
            else:
                print("❌ Invitation token not found in database")
                return False
        except Exception as e:
            print(f"❌ Error retrieving invitation: {e}")
            return False
    else:
        print(f"❌ Invitation sending failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return False
    
    # Step 3: Accept invitation
    print("\n3. Testing invitation acceptance...")
    
    accept_data = {
        'token': invitation_token,
        'username': f'newteammember{timestamp}',
        'password': 'NewUserPass123!',
        'password2': 'NewUserPass123!'
    }
    
    response = requests.post(f'{BASE_URL}/users/invitation/accept/', json=accept_data)
    
    if response.status_code == 200:
        print("✅ Invitation accepted successfully!")
        accept_response = response.json()
        
        print(f"   New user token: {accept_response.get('token', 'N/A')[:20]}...")
        print(f"   User ID: {accept_response.get('user', {}).get('id', 'N/A')}")
        print(f"   Username: {accept_response.get('user', {}).get('username', 'N/A')}")
        print(f"   Organization: {accept_response.get('user', {}).get('organization_name', 'N/A')}")
        
        # Verify the user was created in database
        try:
            new_user = CustomUser.objects.get(username=f'newteammember{timestamp}')
            print(f"   ✅ User found in database: {new_user.email}")
            print(f"   ✅ Organization: {new_user.organization.name}")
            print(f"   ✅ Role: {new_user.role}")
        except CustomUser.DoesNotExist:
            print("   ❌ User not found in database")
            return False
            
    else:
        print(f"❌ Invitation acceptance failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return False
    
    # Step 4: Test authentication with new user
    print("\n4. Testing authentication with new user...")
    login_data = {
        'email': f'newmember{timestamp}@testaccept.com',
        'password': 'NewUserPass123!'
    }
    
    response = requests.post(f'{BASE_URL}/users/login/', json=login_data)
    
    if response.status_code == 200:
        print("✅ New user can login successfully!")
        login_response = response.json()
        print(f"   Login token: {login_response.get('token', 'N/A')[:20]}...")
    else:
        print(f"❌ New user login failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 ALL TESTS PASSED! Invitation acceptance is working correctly!")
    print("=" * 50)
    
    return True

def cleanup_test_data():
    """Clean up test data"""
    try:
        # Delete test organizations with timestamp pattern
        import time
        current_time = int(time.time())
        # Clean up organizations created in the last hour (3600 seconds)
        for i in range(3600):
            timestamp = str(current_time - i)
            org_name = f'Test Accept Org {timestamp}'
            org = Organization.objects.filter(name=org_name).first()
            if org:
                org.delete()
                print(f"✅ Cleaned up organization: {org_name}")
                break
    except Exception as e:
        print(f"⚠️  Cleanup warning: {e}")

if __name__ == '__main__':
    try:
        success = test_invitation_acceptance()
        if success:
            print("\n🔧 Cleaning up test data...")
            cleanup_test_data()
        else:
            print("\n❌ Tests failed. Check the output above for details.")
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
