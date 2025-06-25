#!/usr/bin/env python3
"""
Demo script for the complete organization-based signup and email invitation flow
"""
import os
import sys
import django
import requests
import json
import time

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import CustomUser, Organization

def demo_complete_flow():
    """Demo the complete organization signup and email invitation flow"""
    
    print("=== WorkTally Organization & Email Invitation Demo ===\n")
    
    # Base URL for API
    BASE_URL = 'http://127.0.0.1:8000'
    FRONTEND_URL = 'http://localhost:3000'
    
    # Clear existing demo data
    print("🧹 Cleaning up existing demo data...")
    CustomUser.objects.filter(email__contains='demo').delete()
    Organization.objects.filter(name__contains='Demo').delete()
    print("✓ Cleanup complete\n")
    
    # 1. Organization Registration
    print("1️⃣  ORGANIZATION REGISTRATION")
    print("=" * 40)
    
    signup_data = {
        'organization_name': 'Demo Tech Solutions',
        'organization_description': 'A demonstration technology company for WorkTally',
        'first_name': 'Alice',
        'last_name': 'Manager',
        'username': 'alice.manager',
        'email': 'alice.manager@demo.com',
        'password': 'DemoPassword123!',
        'password2': 'DemoPassword123!',
        'role': 'creator'
    }
    
    print(f"Creating organization: {signup_data['organization_name']}")
    print(f"Creator: {signup_data['first_name']} {signup_data['last_name']} ({signup_data['email']})")
    
    response = requests.post(f'{BASE_URL}/api/users/organization/register/', json=signup_data)
    
    if response.status_code == 201:
        print("✅ Organization created successfully!")
        auth_data = response.json()
        creator_token = auth_data.get('token')
        
        print(f"   📧 Creator Email: {auth_data.get('user', {}).get('email')}")
        print(f"   🏢 Organization: {auth_data.get('organization', {}).get('name')}")
        print(f"   🔑 Auth Token: {creator_token[:20]}...")
        print()
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")
        return False
    
    # 2. Team Member Invitations
    print("2️⃣  TEAM MEMBER INVITATIONS")
    print("=" * 40)
    
    headers = {
        'Authorization': f'Token {creator_token}',
        'Content-Type': 'application/json'
    }
    
    team_members = [
        {
            'email': 'bob.developer@demo.com',
            'first_name': 'Bob',
            'last_name': 'Developer',
            'role': 'employee'
        },
        {
            'email': 'carol.admin@demo.com',
            'first_name': 'Carol',
            'last_name': 'Admin',
            'role': 'admin'
        },
        {
            'email': 'david.designer@demo.com',
            'first_name': 'David',
            'last_name': 'Designer',
            'role': 'employee'
        }
    ]
    
    invitation_tokens = []
    
    for i, member in enumerate(team_members, 1):
        print(f"Inviting {member['first_name']} {member['last_name']} ({member['role']})...")
        
        response = requests.post(f'{BASE_URL}/api/users/organization/invite/', 
                            json=member, headers=headers)
        
        if response.status_code == 201:
            print(f"✅ Invitation sent to {member['email']}")
            
            # Get the invitation token
            invited_user = CustomUser.objects.get(email=member['email'], is_invited=True)
            invitation_tokens.append({
                'token': str(invited_user.invitation_token),
                'email': member['email'],
                'name': f"{member['first_name']} {member['last_name']}"
            })
            
            # Print invitation link
            invitation_link = f"{FRONTEND_URL}/accept-invitation?token={invited_user.invitation_token}"
            print(f"   🔗 Invitation Link: {invitation_link}")
            print()
        else:
            print(f"❌ Failed to invite {member['email']}: {response.status_code}")
            print(f"   Response: {response.text}")
    
    # 3. Simulate Invitation Acceptance
    print("3️⃣  INVITATION ACCEPTANCE SIMULATION")
    print("=" * 40)
    
    # Accept first invitation (Bob Developer)
    if invitation_tokens:
        bob_invitation = invitation_tokens[0]
        print(f"Accepting invitation for {bob_invitation['name']}...")
        
        accept_data = {
            'token': bob_invitation['token'],
            'username': 'bob.developer',
            'password': 'DemoPassword123!',
            'password2': 'DemoPassword123!'
        }
        
        response = requests.post(f'{BASE_URL}/api/users/invitation/accept/', json=accept_data)
        
        if response.status_code == 200:
            print("✅ Invitation accepted successfully!")
            accept_response = response.json()
            bob_token = accept_response.get('token')
            print(f"   👤 User: {accept_response.get('user', {}).get('first_name')} {accept_response.get('user', {}).get('last_name')}")
            print(f"   🔑 Auth Token: {bob_token[:20]}...")
            print()
        else:
            print(f"❌ Failed to accept invitation: {response.status_code}")
            print(f"   Response: {response.text}")
    
    # 4. Team Data Verification
    print("4️⃣  TEAM DATA VERIFICATION")
    print("=" * 40)
    
    response = requests.get(f'{BASE_URL}/api/users/organization/team/', headers=headers)
    
    if response.status_code == 200:
        print("✅ Team data retrieved successfully!")
        team_data = response.json()
        
        print(f"   🏢 Organization: {team_data.get('organization', {}).get('name')}")
        print(f"   📊 Active Members: {len(team_data.get('active_members', []))}")
        print(f"   ⏳ Pending Invitations: {len(team_data.get('pending_invitations', []))}")
        print()
        
        print("📋 TEAM ROSTER:")
        print("   Active Members:")
        for member in team_data.get('active_members', []):
            status_icon = "👑" if member.get('role') == 'creator' else "👤"
            print(f"   {status_icon} {member.get('first_name')} {member.get('last_name')} ({member.get('role')}) - {member.get('email')}")
        
        print("   Pending Invitations:")
        for invitation in team_data.get('pending_invitations', []):
            print(f"   ⏳ {invitation.get('first_name')} {invitation.get('last_name')} ({invitation.get('role')}) - {invitation.get('email')}")
        print()
    else:
        print(f"❌ Failed to retrieve team data: {response.status_code}")
        return False
    
    # 5. Frontend Integration Info
    print("5️⃣  FRONTEND INTEGRATION")
    print("=" * 40)
    print("🌐 Frontend URLs:")
    print(f"   • Main App: {FRONTEND_URL}")
    print(f"   • Login: {FRONTEND_URL}/login")
    print(f"   • Organization Signup: {FRONTEND_URL}/signup")
    print(f"   • Team Management: {FRONTEND_URL}/dashboard/team")
    print()
    
    print("🔗 Invitation Links (copy these to test frontend):")
    for invitation in invitation_tokens[1:]:  # Skip Bob since he already accepted
        invitation_link = f"{FRONTEND_URL}/accept-invitation?token={invitation['token']}"
        print(f"   • {invitation['name']}: {invitation_link}")
    print()
    
    # 6. Test Credentials
    print("6️⃣  TEST CREDENTIALS")
    print("=" * 40)
    print("🔑 Login Credentials for Frontend Testing:")
    print(f"   Creator: {signup_data['email']} / {signup_data['password']}")
    if 'bob_token' in locals():
        print(f"   Employee: bob.developer@demo.com / DemoPassword123!")
    print()
    
    print("=== DEMO COMPLETE ===")
    print("✨ The organization-based signup and email invitation system is ready!")
    print()
    print("🎯 Next Steps:")
    print("   1. Open http://localhost:3000 in your browser")
    print("   2. Test organization signup flow")
    print("   3. Login as creator and invite team members")
    print("   4. Use the invitation links to test acceptance flow")
    print("   5. Check team management page")
    
    return True

if __name__ == '__main__':
    success = demo_complete_flow()
    sys.exit(0 if success else 1)
