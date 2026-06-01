import json
from datetime import datetime
from typing import Literal, Optional

from fastapi import APIRouter
from litellm import completion
from pydantic import BaseModel

router = APIRouter()

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}


class ExtractedParty(BaseModel):
    company: Optional[str] = None
    signatoryName: Optional[str] = None
    title: Optional[str] = None
    noticeAddress: Optional[str] = None


class ChatResponse(BaseModel):
    message: str
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTermType: Optional[Literal["expires", "until_terminated"]] = None
    mndaTermYears: Optional[int] = None
    confidentialityTermType: Optional[Literal["years", "perpetuity"]] = None
    confidentialityTermYears: Optional[int] = None
    governingLawState: Optional[str] = None
    jurisdictionDescription: Optional[str] = None
    modifications: Optional[str] = None
    party1: Optional[ExtractedParty] = None
    party2: Optional[ExtractedParty] = None


class ChatRequest(BaseModel):
    messages: list[dict]
    current_fields: dict


def _build_system_prompt(today: str, current_fields: dict) -> str:
    return f"""You are a friendly legal assistant helping a user complete a Mutual Non-Disclosure Agreement (NDA).

Your response must be a JSON object. The "message" field is your conversational reply to the user. All other fields represent NDA values you have extracted from the conversation so far.

Conversation guidelines for "message":
- Be warm, concise, and professional (2-4 sentences)
- Ask about 1-2 missing fields per response, prioritising the most important ones
- Party details (company names, signatory names, titles, notice addresses) are highest priority
- After gathering party info, ask about purpose, effective date, governing law, and term lengths
- Acknowledge what you have understood before asking the next question
- When all key fields are complete, confirm the document is ready to download

Field extraction rules (all JSON keys except "message"):
- Only populate a field if the user explicitly mentioned it in this conversation
- Use null for any field not yet discussed or that is unclear
- effectiveDate format: YYYY-MM-DD (if user says "today", use {today})
- mndaTermType: exactly "expires" or "until_terminated"
- confidentialityTermType: exactly "years" or "perpetuity"
- mndaTermYears and confidentialityTermYears: integers 1-10
- Only set party sub-fields (company, signatoryName, title, noticeAddress) that the user explicitly stated
- Do not re-populate fields already in Current Fields unless the user explicitly changed them

Current NDA fields already populated:
{json.dumps(current_fields, indent=2)}"""


@router.post("/message", response_model=ChatResponse)
async def chat_message(body: ChatRequest) -> ChatResponse:
    today = datetime.now().strftime("%Y-%m-%d")
    messages = [
        {"role": "system", "content": _build_system_prompt(today, body.current_fields)},
        *body.messages,
    ]
    response = completion(
        model=MODEL,
        messages=messages,
        response_format=ChatResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
    )
    return ChatResponse.model_validate_json(response.choices[0].message.content)
