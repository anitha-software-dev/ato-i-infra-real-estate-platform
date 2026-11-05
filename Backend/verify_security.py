import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from rest_framework.test import APIClient
from api.models import User, ActivityLog, Lead
from api.authentication import generate_token

def run_security_tests():
    print("==================================================")
    print("Running Security & Authorization Verification Tests")
    print("==================================================")

    client = APIClient()

    # Retrieve existing test accounts
    admin_user = User.objects.filter(role='ADMIN').first()
    normal_user = User.objects.filter(role='USER').first()

    assert admin_user is not None, "At least one ADMIN user must exist in DB for testing"
    assert normal_user is not None, "At least one USER user must exist in DB for testing"

    admin_token = generate_token(admin_user)
    user_token = generate_token(normal_user)

    print(f"Admin: {admin_user.email} (Role: {admin_user.role})")
    print(f"User:  {normal_user.email} (Role: {normal_user.role})")
    print("--------------------------------------------------")

    # ========================================================
    # 1. Registration Lockdown Tests
    # ========================================================
    print("\n--- 1. Testing Registration API Lockdown ---")

    # 1.1 Unauthenticated public registration when admin exists -> MUST be 403 Forbidden
    resp = client.post('/api/v1/auth/register/', {
        'name': 'Hacker Public',
        'email': 'hacker@example.com',
        'password': 'password123'
    }, format='json')
    print(f"[TEST 1.1] Public unauthenticated register: Status {resp.status_code}")
    assert resp.status_code == 403, f"Expected 403, got {resp.status_code}: {resp.data}"
    assert resp.data.get('success') is False
    print("  -> PASSED (HTTP 403 Forbidden properly returned)")

    # 1.2 Authenticated USER role register -> MUST be 403 Forbidden
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {user_token}')
    resp = client.post('/api/v1/auth/register/', {
        'name': 'User Attempt',
        'email': 'attempt@example.com',
        'password': 'password123'
    }, format='json')
    print(f"[TEST 1.2] Regular USER role register: Status {resp.status_code}")
    assert resp.status_code == 403, f"Expected 403, got {resp.status_code}: {resp.data}"
    assert resp.data.get('success') is False
    print("  -> PASSED (HTTP 403 Forbidden properly returned)")

    # 1.3 Authenticated ADMIN role register -> MUST succeed
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
    test_email = 'staff_registered@atoiinfra.com'
    User.objects.filter(email=test_email).delete() # Cleanup if exists
    resp = client.post('/api/v1/auth/register/', {
        'name': 'Staff Member',
        'email': test_email,
        'password': 'password123',
        'role': 'USER'
    }, format='json')
    print(f"[TEST 1.3] ADMIN role register: Status {resp.status_code}")
    assert resp.status_code == 201, f"Expected 201, got {resp.status_code}: {resp.data}"
    assert resp.data.get('success') is True
    created_id = resp.data['data']['id']
    User.objects.filter(id=created_id).delete() # Cleanup
    print("  -> PASSED (HTTP 201 Created properly returned)")

    # 1.4 Bootstrap test: If 0 admins exist in system -> MUST allow public registration
    from unittest.mock import patch
    original_filter = User.objects.filter
    def mock_filter(*args, **kwargs):
        if kwargs == {'role': 'ADMIN'}:
            class MockQuerySet:
                def exists(self):
                    return False
            return MockQuerySet()
        return original_filter(*args, **kwargs)

    client.credentials() # Unauthenticated
    with patch('api.models.User.objects.filter', side_effect=mock_filter):
        bootstrap_email = 'bootstrap_admin@atoiinfra.com'
        User.objects.filter(email=bootstrap_email).delete()
        resp = client.post('/api/v1/auth/register/', {
            'name': 'Bootstrap Super Admin',
            'email': bootstrap_email,
            'password': 'password123'
        }, format='json')
        print(f"[TEST 1.4] Bootstrap initial admin register (0 admins exist): Status {resp.status_code}")
        assert resp.status_code == 201, f"Expected 201, got {resp.status_code}: {resp.data}"
        assert resp.data.get('success') is True
        User.objects.filter(email=bootstrap_email).delete()
        print("  -> PASSED (Bootstrap registration allowed when no admin exists)")

    # ========================================================
    # 2. User Management Routes Security Tests
    # ========================================================
    print("\n--- 2. Testing User Management Routes Security ---")

    # 2.1 Unauthenticated requests to /api/v1/users/ -> MUST be 401
    client.credentials() # Clear credentials
    resp = client.get('/api/v1/users/')
    print(f"[TEST 2.1] Unauthenticated GET /users/: Status {resp.status_code}")
    assert resp.status_code == 401, f"Expected 401, got {resp.status_code}: {resp.data}"
    print("  -> PASSED (HTTP 401 Unauthorized properly returned)")

    # 2.2 Unauthenticated GET /api/v1/users/activities/ -> MUST be 401
    resp = client.get('/api/v1/users/activities/')
    print(f"[TEST 2.2] Unauthenticated GET /users/activities/: Status {resp.status_code}")
    assert resp.status_code == 401, f"Expected 401, got {resp.status_code}: {resp.data}"
    print("  -> PASSED (HTTP 401 Unauthorized properly returned)")

    # 2.3 Regular USER role GET /api/v1/users/ -> MUST be 403 Forbidden
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {user_token}')
    resp = client.get('/api/v1/users/')
    print(f"[TEST 2.3] Regular USER GET /users/: Status {resp.status_code}")
    assert resp.status_code == 403, f"Expected 403, got {resp.status_code}: {resp.data}"
    print("  -> PASSED (HTTP 403 Forbidden properly returned)")

    # 2.4 Regular USER role GET /api/v1/users/activities/ -> MUST be 403 Forbidden
    resp = client.get('/api/v1/users/activities/')
    print(f"[TEST 2.4] Regular USER GET /users/activities/: Status {resp.status_code}")
    assert resp.status_code == 403, f"Expected 403, got {resp.status_code}: {resp.data}"
    print("  -> PASSED (HTTP 403 Forbidden properly returned)")

    # 2.5 Regular USER role POST /api/v1/users/ (create user) -> MUST be 403 Forbidden
    resp = client.post('/api/v1/users/', {
        'name': 'Illegal Create',
        'email': 'illegal@atoiinfra.com',
        'password': 'password123'
    }, format='json')
    print(f"[TEST 2.5] Regular USER POST /users/: Status {resp.status_code}")
    assert resp.status_code == 403, f"Expected 403, got {resp.status_code}: {resp.data}"
    print("  -> PASSED (HTTP 403 Forbidden properly returned)")

    # 2.6 ADMIN role GET /api/v1/users/ -> MUST be 200 OK
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
    resp = client.get('/api/v1/users/')
    print(f"[TEST 2.6] ADMIN GET /users/: Status {resp.status_code}")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.data}"
    assert resp.data.get('success') is True
    print("  -> PASSED (HTTP 200 OK with user list)")

    # 2.7 ADMIN role GET /api/v1/users/activities/ -> MUST be 200 OK
    resp = client.get('/api/v1/users/activities/')
    print(f"[TEST 2.7] ADMIN GET /users/activities/: Status {resp.status_code}")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.data}"
    assert resp.data.get('success') is True
    print("  -> PASSED (HTTP 200 OK with activities list)")

    # 2.8 ADMIN role POST /api/v1/users/ (Create staff user) -> MUST be 201 Created
    test_staff_email = 'staff_agent_test@atoiinfra.com'
    User.objects.filter(email=test_staff_email).delete()
    resp = client.post('/api/v1/users/', {
        'name': 'Agent Staff',
        'email': test_staff_email,
        'password': 'temporaryPassword123',
        'role': 'USER',
        'status': 'Active',
        'phone': '9876543210'
    }, format='json')
    print(f"[TEST 2.8] ADMIN POST /users/ (Add User): Status {resp.status_code}")
    assert resp.status_code == 201, f"Expected 201, got {resp.status_code}: {resp.data}"
    assert resp.data.get('success') is True
    new_user_id = resp.data['data']['id']
    assert resp.data['data']['email'] == test_staff_email
    assert resp.data['data']['role'] == 'USER'
    print("  -> PASSED (User created successfully)")

    # 2.9 ADMIN role PUT /api/v1/users/<id>/ -> MUST be 200 OK
    resp = client.put(f'/api/v1/users/{new_user_id}/', {
        'name': 'Agent Staff Updated',
        'phone': '9999999999'
    }, format='json')
    print(f"[TEST 2.9] ADMIN PUT /users/{new_user_id}/: Status {resp.status_code}")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.data}"
    assert resp.data['data']['name'] == 'Agent Staff Updated'
    print("  -> PASSED (User updated successfully)")

    # 2.10 ADMIN role DELETE /api/v1/users/<id>/ -> MUST be 200 OK
    resp = client.delete(f'/api/v1/users/{new_user_id}/')
    print(f"[TEST 2.10] ADMIN DELETE /users/{new_user_id}/: Status {resp.status_code}")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.data}"
    assert not User.objects.filter(id=new_user_id).exists()
    print("  -> PASSED (User deleted successfully)")

    # ========================================================
    # 3. Setup Status & Leads Route Security Tests
    # ========================================================
    print("\n--- 3. Testing Setup Status & Leads Route Security ---")

    # 3.1 Setup Status endpoint
    client.credentials() # Unauthenticated
    resp = client.get('/api/v1/auth/setup-status/')
    print(f"[TEST 3.1] GET /auth/setup-status/: Status {resp.status_code}")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.data}"
    assert resp.data['data']['adminExists'] is True
    assert resp.data['data']['allowSignup'] is False
    print("  -> PASSED (adminExists=True, allowSignup=False correctly reported)")

    # 3.2 Unauthenticated GET /leads/ -> MUST be 401
    resp = client.get('/api/v1/leads/')
    print(f"[TEST 3.2] Unauthenticated GET /leads/: Status {resp.status_code}")
    assert resp.status_code == 401, f"Expected 401, got {resp.status_code}: {resp.data}"
    print("  -> PASSED (HTTP 401 Unauthorized properly returned)")

    # 3.3 Regular USER role GET /leads/ -> Allowed (staff can view customer inquiries in CRM)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {user_token}')
    resp = client.get('/api/v1/leads/')
    print(f"[TEST 3.3] Regular USER GET /leads/: Status {resp.status_code}")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.data}"
    assert resp.data.get('success') is True
    print("  -> PASSED (HTTP 200 OK: Regular staff can view customer inquiries)")

    # 3.3b Regular USER role DELETE /leads/<id>/ -> MUST be 403 Forbidden (Delete is Admin-only)
    dummy_lead = Lead.objects.first()
    if dummy_lead:
        resp = client.delete(f'/api/v1/leads/{dummy_lead.id}/')
        print(f"[TEST 3.3b] Regular USER DELETE /leads/: Status {resp.status_code}")
        assert resp.status_code == 403, f"Expected 403, got {resp.status_code}: {resp.data}"
        print("  -> PASSED (HTTP 403 Forbidden: Regular staff cannot delete leads)")

    # 3.4 ADMIN role GET /leads/ -> MUST be 200 OK
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
    resp = client.get('/api/v1/leads/')
    print(f"[TEST 3.4] ADMIN GET /leads/: Status {resp.status_code}")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.data}"
    assert resp.data.get('success') is True
    print("  -> PASSED (HTTP 200 OK with CRM leads)")

    # 3.5 Simultaneous registration protection: concurrent requests
    import concurrent.futures
    def try_register(idx):
        c = APIClient()
        return c.post('/api/v1/auth/register/', {
            'name': f'Hacker {idx}',
            'email': f'hacker{idx}@example.com',
            'password': 'password123'
        }, format='json')

    print("[TEST 3.5] Simultaneous signup requests against existing system:")
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(try_register, i) for i in range(5)]
        results = [f.result() for f in futures]
    
    statuses = [r.status_code for r in results]
    print(f"  Concurrent status codes: {statuses}")
    assert all(s == 403 for s in statuses), f"All concurrent attempts must be 403, got {statuses}"
    print("  -> PASSED (All simultaneous public registration attempts rejected with HTTP 403)")

    print("\n==================================================")
    print("ALL 15 SECURITY & AUTHORIZATION TESTS PASSED!")
    print("==================================================")

if __name__ == '__main__':
    run_security_tests()
