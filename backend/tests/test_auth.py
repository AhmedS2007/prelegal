import pytest
from fastapi.testclient import TestClient

from prelegal.main import app

client = TestClient(app)


def test_signup_returns_token():
    response = client.post(
        "/api/auth/signup",
        json={"email": "alice@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["token"], str)
    assert len(data["token"]) > 10


def test_signup_duplicate_email_returns_409():
    client.post("/api/auth/signup", json={"email": "bob@example.com", "password": "pass1"})
    response = client.post(
        "/api/auth/signup", json={"email": "bob@example.com", "password": "pass2"}
    )
    assert response.status_code == 409


def test_signin_valid_credentials_returns_token():
    client.post("/api/auth/signup", json={"email": "carol@example.com", "password": "mypassword"})
    response = client.post(
        "/api/auth/signin", json={"email": "carol@example.com", "password": "mypassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["token"], str)


def test_signin_wrong_password_returns_401():
    client.post("/api/auth/signup", json={"email": "dave@example.com", "password": "correct"})
    response = client.post(
        "/api/auth/signin", json={"email": "dave@example.com", "password": "wrong"}
    )
    assert response.status_code == 401


def test_signin_unknown_email_returns_401():
    response = client.post(
        "/api/auth/signin", json={"email": "nobody@example.com", "password": "any"}
    )
    assert response.status_code == 401


def test_me_returns_user_with_valid_token():
    signup = client.post(
        "/api/auth/signup", json={"email": "eve@example.com", "password": "pass"}
    )
    token = signup.json()["token"]
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    user = response.json()["user"]
    assert user["email"] == "eve@example.com"


def test_me_without_token_returns_401():
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_me_with_invalid_token_returns_401():
    response = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid.token.here"})
    assert response.status_code == 401


def test_signout_returns_success():
    response = client.post("/api/auth/signout")
    assert response.status_code == 200
    assert response.json()["success"] is True
