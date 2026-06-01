import sqlite3

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..auth import create_access_token, hash_password, verify_password
from ..database import get_connection
from ..dependencies import get_current_user

router = APIRouter()


class AuthRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
async def signup(body: AuthRequest):
    conn = get_connection()
    try:
        hashed = hash_password(body.password)
        try:
            cursor = conn.execute(
                "INSERT INTO users (email, hashed_password) VALUES (?, ?)",
                (body.email, hashed),
            )
            conn.commit()
            user_id = cursor.lastrowid
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=409, detail="Email already registered")
        token = create_access_token(user_id, body.email)
        return {"success": True, "token": token}
    finally:
        conn.close()


@router.post("/signin")
async def signin(body: AuthRequest):
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT id, hashed_password FROM users WHERE email = ?",
            (body.email,),
        ).fetchone()
        if not row or not verify_password(body.password, row["hashed_password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        token = create_access_token(row["id"], body.email)
        return {"success": True, "token": token}
    finally:
        conn.close()


@router.post("/signout")
async def signout():
    return {"success": True}


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT id, email, created_at FROM users WHERE id = ?",
            (current_user["user_id"],),
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "user": {
                "id": row["id"],
                "email": row["email"],
                "created_at": row["created_at"],
            }
        }
    finally:
        conn.close()
