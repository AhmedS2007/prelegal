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


class GenericChatResponse(BaseModel):
    message: str
    party1: Optional[ExtractedParty] = None
    party2: Optional[ExtractedParty] = None
    effectiveDate: Optional[str] = None
    term: Optional[str] = None
    governingLawState: Optional[str] = None
    jurisdictionDescription: Optional[str] = None
    specialTerms: Optional[str] = None


class ChatRequest(BaseModel):
    messages: list[dict]
    current_fields: dict
    document_type: str = "mnda"


_DOC_META: dict[str, dict] = {
    "csa": {
        "name": "Cloud Service Agreement",
        "party1_label": "Provider",
        "party2_label": "Customer",
        "specific_fields": (
            "subscription period (how long the customer subscribes to the cloud service), "
            "fees and payment terms (amount, billing frequency, payment method)"
        ),
    },
    "design-partner": {
        "name": "Design Partner Agreement",
        "party1_label": "Provider",
        "party2_label": "Partner",
        "specific_fields": (
            "program description (what product or feature the partner is testing and what "
            "type of feedback is expected), fees if any"
        ),
    },
    "sla": {
        "name": "Service Level Agreement",
        "party1_label": "Provider",
        "party2_label": "Customer",
        "specific_fields": (
            "uptime commitment (e.g. 99.9%), response time targets for different incident "
            "severity levels, any service credits or remedies for downtime"
        ),
    },
    "psa": {
        "name": "Professional Services Agreement",
        "party1_label": "Provider",
        "party2_label": "Customer",
        "specific_fields": (
            "scope of services (description of professional services to be provided), "
            "fees and payment terms, key deliverables"
        ),
    },
    "dpa": {
        "name": "Data Processing Agreement",
        "party1_label": "Provider",
        "party2_label": "Customer",
        "specific_fields": (
            "categories of personal data being processed (e.g. contact data, usage data), "
            "categories of data subjects (e.g. employees, end users), "
            "governing EU member state for GDPR compliance purposes"
        ),
    },
    "software-license": {
        "name": "Software License Agreement",
        "party1_label": "Provider",
        "party2_label": "Customer",
        "specific_fields": (
            "license scope (what the customer is authorized to do with the software, "
            "e.g. internal use only, number of permitted seats or users), "
            "fees and payment terms"
        ),
    },
    "partnership": {
        "name": "Partnership Agreement",
        "party1_label": "Provider",
        "party2_label": "Partner",
        "specific_fields": (
            "revenue share or referral fee terms (percentage or flat fee per referral), "
            "any co-marketing obligations, partner program tier if applicable"
        ),
    },
    "pilot": {
        "name": "Pilot Agreement",
        "party1_label": "Provider",
        "party2_label": "Customer",
        "specific_fields": (
            "pilot scope (what product or service is being trialed and for what purpose), "
            "fees during the pilot if any, success criteria and path to full commercial agreement"
        ),
    },
    "baa": {
        "name": "Business Associate Agreement",
        "party1_label": "Covered Entity",
        "party2_label": "Business Associate",
        "specific_fields": (
            "categories of protected health information (PHI) involved "
            "(e.g. medical records, billing information), "
            "permitted uses and disclosures of PHI, breach notification period"
        ),
    },
    "ai-addendum": {
        "name": "AI Addendum",
        "party1_label": "Provider",
        "party2_label": "Customer",
        "specific_fields": (
            "whether customer data may be used to train or improve AI models "
            "(yes, no, or with restrictions), "
            "who owns AI-generated outputs, any AI-specific liability limitations"
        ),
    },
}


def _build_mnda_system_prompt(today: str, current_fields: dict) -> str:
    return f"""You are a friendly legal assistant helping a user complete a Mutual Non-Disclosure Agreement (NDA).

Your response must be a JSON object. The "message" field is your conversational reply to the user. All other fields represent NDA values you have extracted from the conversation so far.

ALL of the following fields must be collected before the document is complete. Work through them conversationally, asking exactly ONE question at a time:

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
- Ask exactly ONE question at a time, following the group order above
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


def _build_generic_system_prompt(today: str, current_fields: dict, doc_type: str) -> str:
    meta = _DOC_META.get(doc_type, {})
    doc_name = meta.get("name", "Legal Agreement")
    party1_label = meta.get("party1_label", "Party 1")
    party2_label = meta.get("party2_label", "Party 2")
    specific_fields_desc = meta.get(
        "specific_fields",
        "any special terms or conditions specific to this agreement",
    )

    return f"""You are a friendly legal assistant helping a user complete a {doc_name}.

Your response must be a JSON object. The "message" field is your conversational reply to the user. All other fields represent document values you have extracted from the conversation so far.

ALL of the following fields must be collected before the document is complete. Work through them conversationally, asking exactly ONE question at a time:

GROUP 1 - Parties (ask first):
  - party1: the {party1_label}'s company name, signatory name, title, and notice address (email or postal)
  - party2: the {party2_label}'s company name, signatory name, title, and notice address (email or postal)

GROUP 2 - Agreement basics (ask after parties):
  - effectiveDate: the date the agreement takes effect (offer today, {today}, as the default)
  - term: the duration of the agreement (e.g. "1 year", "2 years from effective date", "until terminated by either party")
  - governingLawState: which US state's law governs the agreement (e.g. Delaware)
  - jurisdictionDescription: where disputes will be resolved (e.g. "courts located in Wilmington, DE")

GROUP 3 - Document-specific terms (ask after basics):
  - specialTerms: {specific_fields_desc}
  Ask about these one item at a time; the user can say "none" or "standard" to use defaults.

Conversation guidelines for "message":
- Be warm, concise, and professional (2-4 sentences per reply)
- Check "Current fields" below and skip any field already populated — never ask twice
- Ask exactly ONE question at a time, following the group order above
- When all fields in all groups are populated, confirm the document is complete and ready to download
- If the user mentions wanting a completely different type of document, acknowledge their need and let them know they can return to the document selector to start fresh

Field extraction rules (all JSON keys except "message"):
- Only populate a field if the user explicitly stated it in this conversation
- Use null for any field not yet discussed or that is unclear
- effectiveDate format: YYYY-MM-DD (if user says "today", use {today})
- Only set party sub-fields that the user explicitly provided
- Do not re-populate a field already in Current Fields unless the user explicitly changed it
- Put all document-specific information in the specialTerms field as a clear, concise summary

Current fields already populated:
{json.dumps(current_fields, indent=2)}"""


@router.post("/message")
async def chat_message(body: ChatRequest):
    today = datetime.now().strftime("%Y-%m-%d")
    doc_type = body.document_type.lower()

    if doc_type in ("mnda", "mnda-coverpage"):
        system_prompt = _build_mnda_system_prompt(today, body.current_fields)
        response_cls = ChatResponse
    elif doc_type in _DOC_META:
        system_prompt = _build_generic_system_prompt(today, body.current_fields, doc_type)
        response_cls = GenericChatResponse
    else:
        # Unknown document type — fall back to generic guidance
        system_prompt = _build_generic_system_prompt(today, body.current_fields, "csa")
        response_cls = GenericChatResponse

    messages = [
        {"role": "system", "content": system_prompt},
        *body.messages,
    ]
    response = completion(
        model=MODEL,
        messages=messages,
        response_format=response_cls,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
    )
    return response_cls.model_validate_json(response.choices[0].message.content)
