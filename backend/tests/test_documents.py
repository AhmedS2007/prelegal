import pytest
from fastapi.testclient import TestClient

from prelegal.main import app

client = TestClient(app)

FORM_DATA = {
    "party1": {"company": "Acme", "signatoryName": "Jane", "title": "CEO", "noticeAddress": ""},
    "party2": {"company": "", "signatoryName": "", "title": "", "noticeAddress": ""},
    "effectiveDate": "2026-01-01",
    "term": "1 year",
    "governingLawState": "Delaware",
    "jurisdictionDescription": "",
    "specialTerms": "",
}


def _signup_and_token(email: str, password: str = "pass123") -> str:
    resp = client.post("/api/auth/signup", json={"email": email, "password": password})
    return resp.json()["token"]


# ── Unauthenticated access ────────────────────────────────────────────────────

def test_save_draft_without_token_returns_401():
    response = client.post(
        "/api/documents",
        json={"document_type": "csa", "doc_name": "Test", "form_data": FORM_DATA, "chat_messages": []},
    )
    assert response.status_code == 401


def test_list_drafts_without_token_returns_401():
    response = client.get("/api/documents")
    assert response.status_code == 401


def test_get_draft_without_token_returns_401():
    response = client.get("/api/documents/1")
    assert response.status_code == 401


# ── Save and retrieve ─────────────────────────────────────────────────────────

def test_save_draft_creates_document():
    token = _signup_and_token("user1@test.com")
    response = client.post(
        "/api/documents",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "document_type": "csa",
            "doc_name": "Acme — Cloud Service Agreement",
            "form_data": FORM_DATA,
            "chat_messages": [{"role": "assistant", "content": "Hello"}],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["document_type"] == "csa"
    assert data["doc_name"] == "Acme — Cloud Service Agreement"
    assert "id" in data


def test_list_drafts_returns_saved_documents():
    token = _signup_and_token("user2@test.com")
    client.post(
        "/api/documents",
        headers={"Authorization": f"Bearer {token}"},
        json={"document_type": "mnda", "doc_name": "Draft 1", "form_data": FORM_DATA, "chat_messages": []},
    )
    client.post(
        "/api/documents",
        headers={"Authorization": f"Bearer {token}"},
        json={"document_type": "csa", "doc_name": "Draft 2", "form_data": FORM_DATA, "chat_messages": []},
    )
    response = client.get("/api/documents", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 2
    names = [i["doc_name"] for i in items]
    assert "Draft 1" in names
    assert "Draft 2" in names


def test_get_draft_returns_full_document():
    token = _signup_and_token("user3@test.com")
    save = client.post(
        "/api/documents",
        headers={"Authorization": f"Bearer {token}"},
        json={"document_type": "dpa", "doc_name": "My DPA", "form_data": FORM_DATA, "chat_messages": []},
    )
    doc_id = save.json()["id"]
    response = client.get(
        f"/api/documents/{doc_id}", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["doc_name"] == "My DPA"
    assert data["form_data"]["party1"]["company"] == "Acme"
    assert isinstance(data["chat_messages"], list)


# ── Update ────────────────────────────────────────────────────────────────────

def test_update_draft_changes_form_data():
    token = _signup_and_token("user4@test.com")
    save = client.post(
        "/api/documents",
        headers={"Authorization": f"Bearer {token}"},
        json={"document_type": "mnda", "doc_name": "Old Name", "form_data": FORM_DATA, "chat_messages": []},
    )
    doc_id = save.json()["id"]
    updated_form = {**FORM_DATA, "party1": {**FORM_DATA["party1"], "company": "NewCo"}}
    response = client.put(
        f"/api/documents/{doc_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"document_type": "mnda", "doc_name": "New Name", "form_data": updated_form, "chat_messages": []},
    )
    assert response.status_code == 200
    assert response.json()["doc_name"] == "New Name"
    # Verify the update persisted
    get_resp = client.get(
        f"/api/documents/{doc_id}", headers={"Authorization": f"Bearer {token}"}
    )
    assert get_resp.json()["form_data"]["party1"]["company"] == "NewCo"


# ── Ownership isolation ───────────────────────────────────────────────────────

def test_list_returns_only_own_documents():
    token_a = _signup_and_token("owner_a@test.com")
    token_b = _signup_and_token("owner_b@test.com")
    client.post(
        "/api/documents",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"document_type": "csa", "doc_name": "A's doc", "form_data": FORM_DATA, "chat_messages": []},
    )
    response = client.get("/api/documents", headers={"Authorization": f"Bearer {token_b}"})
    assert response.status_code == 200
    assert all(i["doc_name"] != "A's doc" for i in response.json())


def test_get_another_users_document_returns_404():
    token_a = _signup_and_token("owner_c@test.com")
    token_b = _signup_and_token("owner_d@test.com")
    save = client.post(
        "/api/documents",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"document_type": "mnda", "doc_name": "Secret", "form_data": FORM_DATA, "chat_messages": []},
    )
    doc_id = save.json()["id"]
    response = client.get(
        f"/api/documents/{doc_id}", headers={"Authorization": f"Bearer {token_b}"}
    )
    assert response.status_code == 404


def test_update_another_users_document_returns_404():
    token_a = _signup_and_token("owner_e@test.com")
    token_b = _signup_and_token("owner_f@test.com")
    save = client.post(
        "/api/documents",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"document_type": "mnda", "doc_name": "Private", "form_data": FORM_DATA, "chat_messages": []},
    )
    doc_id = save.json()["id"]
    response = client.put(
        f"/api/documents/{doc_id}",
        headers={"Authorization": f"Bearer {token_b}"},
        json={"document_type": "mnda", "doc_name": "Hacked", "form_data": FORM_DATA, "chat_messages": []},
    )
    assert response.status_code == 404
