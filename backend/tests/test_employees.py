from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def token():
    username = "employee_test_user"
    password = "Test@12345"
    client.post("/auth/register", json={"username": username, "password": password})
    response = client.post("/auth/login", json={"username": username, "password": password})
    return response.json()["access_token"]

def test_employee_crud():
    headers = {"Authorization": f"Bearer {token()}"}
    email = "ci.employee@example.com"

    create = client.post("/employees", headers=headers, json={
        "name": "CI Employee",
        "email": email,
        "department": "IT",
        "position": "Developer"
    })
    assert create.status_code == 200
    employee_id = create.json()["id"]

    get = client.get(f"/employees/{employee_id}", headers=headers)
    assert get.status_code == 200

    update = client.put(f"/employees/{employee_id}", headers=headers, json={
        "name": "Updated Employee",
        "email": email,
        "department": "IT",
        "position": "Senior Developer"
    })
    assert update.status_code == 200

    delete = client.delete(f"/employees/{employee_id}", headers=headers)
    assert delete.status_code == 200
