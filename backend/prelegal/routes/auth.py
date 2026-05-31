from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter()


class AuthRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
async def signup(body: AuthRequest):
    return {"success": True, "token": "placeholder"}


@router.post("/signin")
async def signin(body: AuthRequest):
    return {"success": True, "token": "placeholder"}


@router.post("/signout")
async def signout():
    return {"success": True}


@router.get("/me")
async def me():
    return {"user": None}
