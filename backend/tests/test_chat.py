import json
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from prelegal.main import app

client = TestClient(app)


def _mock_completion(message: str, **fields) -> MagicMock:
    """Build a mock litellm completion response with a ChatResponse JSON body."""
    data = {"message": message, **fields}
    mock = MagicMock()
    mock.choices[0].message.content = json.dumps(data)
    return mock


def test_chat_message_returns_200():
    with patch("prelegal.routes.chat.completion") as mock_comp:
        mock_comp.return_value = _mock_completion("Which companies are involved?")
        response = client.post(
            "/api/chat/message",
            json={
                "messages": [{"role": "user", "content": "Hi"}],
                "current_fields": {},
            },
        )
    assert response.status_code == 200


def test_chat_message_response_contains_message():
    with patch("prelegal.routes.chat.completion") as mock_comp:
        mock_comp.return_value = _mock_completion("Which companies are involved?")
        response = client.post(
            "/api/chat/message",
            json={
                "messages": [{"role": "user", "content": "Hi"}],
                "current_fields": {},
            },
        )
    assert response.json()["message"] == "Which companies are involved?"


def test_chat_message_returns_extracted_fields():
    with patch("prelegal.routes.chat.completion") as mock_comp:
        mock_comp.return_value = _mock_completion(
            "Got it!",
            party1={
                "company": "Acme",
                "signatoryName": None,
                "title": None,
                "noticeAddress": None,
            },
            governingLawState="Delaware",
        )
        response = client.post(
            "/api/chat/message",
            json={
                "messages": [{"role": "user", "content": "Our company is Acme, Delaware law"}],
                "current_fields": {},
            },
        )
    data = response.json()
    assert data["party1"]["company"] == "Acme"
    assert data["governingLawState"] == "Delaware"


def test_chat_message_passes_conversation_history_to_llm():
    with patch("prelegal.routes.chat.completion") as mock_comp:
        mock_comp.return_value = _mock_completion("Sure!")
        client.post(
            "/api/chat/message",
            json={
                "messages": [
                    {"role": "user", "content": "Hello"},
                    {"role": "assistant", "content": "Hi there!"},
                    {"role": "user", "content": "Our company is Acme"},
                ],
                "current_fields": {},
            },
        )
    call_messages = mock_comp.call_args.kwargs["messages"]
    # System message prepended, then full history
    assert call_messages[0]["role"] == "system"
    assert call_messages[-1]["content"] == "Our company is Acme"
    assert len(call_messages) == 4  # system + 3 user/assistant messages


def test_chat_message_includes_today_in_system_prompt():
    from datetime import datetime

    today = datetime.now().strftime("%Y-%m-%d")
    with patch("prelegal.routes.chat.completion") as mock_comp:
        mock_comp.return_value = _mock_completion("Hi!")
        client.post(
            "/api/chat/message",
            json={"messages": [{"role": "user", "content": "Hi"}], "current_fields": {}},
        )
    system_prompt = mock_comp.call_args.kwargs["messages"][0]["content"]
    assert today in system_prompt


def test_chat_message_invalid_body_returns_422():
    response = client.post(
        "/api/chat/message",
        json={"wrong_field": "oops"},
    )
    assert response.status_code == 422
