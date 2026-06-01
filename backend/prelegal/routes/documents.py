import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..database import get_connection
from ..dependencies import get_current_user

router = APIRouter()


class SaveDraftRequest(BaseModel):
    document_type: str
    doc_name: str
    form_data: dict
    chat_messages: list


@router.post("")
async def save_draft(
    body: SaveDraftRequest, current_user: dict = Depends(get_current_user)
):
    conn = get_connection()
    try:
        cursor = conn.execute(
            """INSERT INTO documents (user_id, document_type, doc_name, form_data, chat_messages)
               VALUES (?, ?, ?, ?, ?)""",
            (
                current_user["user_id"],
                body.document_type,
                body.doc_name,
                json.dumps(body.form_data),
                json.dumps(body.chat_messages),
            ),
        )
        conn.commit()
        doc_id = cursor.lastrowid
        row = conn.execute(
            "SELECT id, document_type, doc_name, updated_at FROM documents WHERE id = ?",
            (doc_id,),
        ).fetchone()
        return {
            "id": row["id"],
            "document_type": row["document_type"],
            "doc_name": row["doc_name"],
            "updated_at": row["updated_at"],
        }
    finally:
        conn.close()


@router.get("")
async def list_drafts(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    try:
        rows = conn.execute(
            """SELECT id, document_type, doc_name, updated_at
               FROM documents
               WHERE user_id = ?
               ORDER BY updated_at DESC""",
            (current_user["user_id"],),
        ).fetchall()
        return [
            {
                "id": r["id"],
                "document_type": r["document_type"],
                "doc_name": r["doc_name"],
                "updated_at": r["updated_at"],
            }
            for r in rows
        ]
    finally:
        conn.close()


@router.get("/{doc_id}")
async def get_draft(doc_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    try:
        row = conn.execute(
            """SELECT id, document_type, doc_name, form_data, chat_messages, created_at, updated_at
               FROM documents WHERE id = ? AND user_id = ?""",
            (doc_id, current_user["user_id"]),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Document not found")
        return {
            "id": row["id"],
            "document_type": row["document_type"],
            "doc_name": row["doc_name"],
            "form_data": json.loads(row["form_data"]),
            "chat_messages": json.loads(row["chat_messages"]),
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }
    finally:
        conn.close()


@router.put("/{doc_id}")
async def update_draft(
    doc_id: int,
    body: SaveDraftRequest,
    current_user: dict = Depends(get_current_user),
):
    conn = get_connection()
    try:
        existing = conn.execute(
            "SELECT id FROM documents WHERE id = ? AND user_id = ?",
            (doc_id, current_user["user_id"]),
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Document not found")

        now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        conn.execute(
            """UPDATE documents
               SET document_type = ?, doc_name = ?, form_data = ?, chat_messages = ?, updated_at = ?
               WHERE id = ? AND user_id = ?""",
            (
                body.document_type,
                body.doc_name,
                json.dumps(body.form_data),
                json.dumps(body.chat_messages),
                now,
                doc_id,
                current_user["user_id"],
            ),
        )
        conn.commit()
        row = conn.execute(
            "SELECT id, document_type, doc_name, updated_at FROM documents WHERE id = ?",
            (doc_id,),
        ).fetchone()
        return {
            "id": row["id"],
            "document_type": row["document_type"],
            "doc_name": row["doc_name"],
            "updated_at": row["updated_at"],
        }
    finally:
        conn.close()
