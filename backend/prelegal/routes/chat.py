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

ALL of the following fields must be collected before the document is complete. Work through them conversationally, asking about 1-2 at a time:

GROUP 1 - Parties (ask first):
  - party1: company name, signatory name, title, notice address (email or postal)
  - party2: company name, signatory name, title, notice address (email or postal)

GROUP 2 - Agreement basics (ask after parties):
  - purpose: why the parties are sharing confidential information
  - effectiveDate: the date the agreement takes effect (offer today, {today}, as the default)
  - governingLawState: which US state's law governs the agreement (e.g. Delaware)
  - jurisdictionDescription: where disputes will be resolved (e.g. "courts located in Wilmington, DE")

GROUP 3 - Terms (ask after basics):
  - mndaTermType + mndaTermYears: does the NDA expire after a fixed number of years, or continue until terminated? If expires, how many years (1-10)?
  - confidentialityTermType + confidentialityTermYears: are confidentiality obligations limited to a fixed number of years, or do they last in perpetuity? If years, how many (1-10)?

GROUP 4 - Optional (ask last):
  - modifications: any changes the parties want to make to the standard terms (it is fine to have none)

Conversation guidelines for "message":
- Be warm, concise, and professional (2-4 sentences per reply)
- Check "Current NDA fields" below and skip any field already populated — never ask twice
- Ask about 1-2 missing fields per response, following the group order above
- For mndaTermType and confidentialityTermType, give the user clear options: e.g. "Does the NDA expire after a fixed number of years, or continue until one party terminates it?"
- When all fields in all groups are populated, confirm the document is complete and ready to download

Field extraction rules (all JSON keys except "message"):
- Only populate a field if the user explicitly stated it in this conversation
- Use null for any field not yet discussed or that is unclear
- effectiveDate format: YYYY-MM-DD (if user says "today", use {today})
- mndaTermType: exactly "expires" or "until_terminated"
- confidentialityTermType: exactly "years" or "perpetuity"
- mndaTermYears and confidentialityTermYears: integers 1-10
- Only set party sub-fields that the user explicitly provided
- Do not re-populate a field already in Current Fields unless the user explicitly changed it

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
