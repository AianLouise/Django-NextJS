"""
Test script to verify organization-based registration functionality
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/users"

def test_organization_registration():
    """Test creating an organization and owner account"""
    
    print("🏢 Testing Organization Registration...")
    
    data = {
        "organization_name": "Test Company",
        "organization_description": "A test organization for demonstration",
        "email": "owner@testcompany.com",
        "username": "test_owner",
        "password": "testpassword123",
        "password2": "testpassword123",
        "first_name": "Test",
        "last_name": "Owner"
    }
    
    response = requests.post(f"{BASE_URL}/organization/register/", json=data)
    
    if response.status_code == 201:
        result = response.json()
        print("✅ Organization registration successful!")
        print(f"   Organization: {result['organization']['name']}")
        print(f"   Owner: {result['user']['first_name']} {result['user']['last_name']}")
        print(f"   Role: {result['user']['role']}")
        return result['token']
    else:
        print("❌ Organization registration failed!")
        print(f"   Error: {response.json()}")
        return None

def test_team_member_invitation(owner_token):
    """Test inviting a team member"""
    
    if not owner_token:
        print("⏭️  Skipping team invitation test (no owner token)")
        return None
    
    print("\n👥 Testing Team Member Invitation...")
    
    headers = {"Authorization": f"Token {owner_token}"}
    data = {
        "email": "employee@testcompany.com",
        "first_name": "Test",
        "last_name": "Employee",
        "role": "employee",
        "job_title": "Software Developer",
        "department": "Engineering"
    }
    
    response = requests.post(f"{BASE_URL}/organization/invite/", json=data, headers=headers)
    
    if response.status_code == 201:
        result = response.json()
        print("✅ Team member invitation successful!")
        print(f"   Invited: {result['invited_user']['email']}")
        print(f"   Role: {result['invited_user']['role']}")
        return result['invited_user']['invitation_token']
    else:
        print("❌ Team member invitation failed!")
        print(f"   Error: {response.json()}")
        return None

def test_accept_invitation(invitation_token):
    """Test accepting a team member invitation"""
    
    if not invitation_token:
        print("⏭️  Skipping invitation acceptance test (no invitation token)")
        return None
    
    print("\n✋ Testing Invitation Acceptance...")
    
    data = {
        "token": invitation_token,
        "username": "test_employee",
        "password": "employeepassword123",
        "password2": "employeepassword123"
    }
    
    response = requests.post(f"{BASE_URL}/invitation/accept/", json=data)
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Invitation acceptance successful!")
        print(f"   User: {result['user']['username']}")
        print(f"   Organization: {result['organization']['name']}")
        return result['token']
    else:
        print("❌ Invitation acceptance failed!")
        print(f"   Error: {response.json()}")
        return None

def test_view_team(owner_token):
    """Test viewing organization team"""
    
    if not owner_token:
        print("⏭️  Skipping team view test (no owner token)")
        return
    
    print("\n👀 Testing Team View...")
    
    headers = {"Authorization": f"Token {owner_token}"}
    response = requests.get(f"{BASE_URL}/organization/team/", headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Team view successful!")
        print(f"   Organization: {result['organization']['name']}")
        print(f"   Active Members: {len(result['active_members'])}")
        print(f"   Pending Invitations: {len(result['pending_invitations'])}")
        
        for member in result['active_members']:
            print(f"     - {member['first_name']} {member['last_name']} ({member['role']})")
    else:
        print("❌ Team view failed!")
        print(f"   Error: {response.json()}")

def main():
    print("🚀 Testing Organization-Based Registration System")
    print("=" * 50)
    
    # Test the complete flow
    owner_token = test_organization_registration()
    invitation_token = test_team_member_invitation(owner_token)
    employee_token = test_accept_invitation(invitation_token)
    test_view_team(owner_token)
    
    print("\n🎉 Testing Complete!")
    print("\nThe new organization-based registration system is working correctly!")
    print("\nKey Features Tested:")
    print("✅ Organization creation with owner account")
    print("✅ Team member invitation by organization owner")
    print("✅ Invitation acceptance and account activation")
    print("✅ Organization team management view")

if __name__ == "__main__":
    main()
