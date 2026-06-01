# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The current implementation has a placeholder login screen and a full AI-powered document drafting interface supporting all 12 Common Paper document types. Users select a document from a catalog grid, then chat with an AI assistant that collects field values conversationally using a single structured-output LLM call (Cerebras via OpenRouter). The document preview updates automatically after each exchange, and completed documents can be exported as PDF or markdown.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.  
The frontend is statically built (`output: 'export'`) and served by FastAPI from the `frontend/out/` directory.  
There should be scripts in scripts/ for:  
```powershell
# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Implementation Status

### Completed (PL-4)
- Mutual NDA manual form with live preview
- PDF download via browser print popup
- Markdown export
- Jest test suite for form, preview, and document generation

### Completed (PL-5)
- Docker multi-stage build (Node frontend + Python/uv backend)
- FastAPI backend with SQLite (fresh DB each container start, users table schema)
- Next.js static export (`output: 'export'`) served by FastAPI at localhost:8000
- Placeholder auth routes: POST /api/auth/signup, POST /api/auth/signin, POST /api/auth/signout, GET /api/auth/me
- Login/signup page with placeholder auth (any credentials accepted)
- Auth gate on main page: redirects to /login if no token in localStorage
- Start/stop scripts for Windows: scripts/start-windows.ps1, scripts/stop-windows.ps1
- Color scheme updated to spec: #ecad0a, #209dd7, #753991, #032147, #888888
- PDF save uses 1.5cm margins on all sides (`@page { margin: 1.5cm }` in generateDocument.ts)

### Completed (PL-6)
- Manual NDA form replaced with freeform AI chat panel (left column)
- Single structured-output LLM call per message returns both the assistant reply and extracted NDA field values (`ChatResponse` Pydantic model)
- `POST /api/chat/message` backend endpoint using litellm + Cerebras via OpenRouter
- Null-safe field merge (`mergeFields.ts`): only non-null AI-extracted values overwrite existing formData; defaultFormData values are never sent to the AI as pre-answered
- System prompt guides the AI through all field groups in order: parties → basics (purpose, date, governing law) → terms (MNDA term, confidentiality term) → modifications
- Chat resets on page refresh (no persistence); Reset button clears chat and form
- PDF and markdown export unchanged; globals.css print margins corrected to 1.5cm uniform
- Jest test suite: mergeFields unit tests, NDAChat component tests, updated page tests (150 total)
- Backend pytest suite: 6 tests for chat endpoint with mocked litellm

### Completed (PL-7)
- Document selector landing page: catalog grid showing all 12 Common Paper document types; users pick before drafting
- Mutual NDA keeps full custom chat + preview UI (`NDAChat`, `NDAPreview`); all other 11 document types use generic `DocumentChat` + `DocumentPreview` components
- Generic cover-page schema: parties (company, signatory, title, address), effective date, term, governing law, jurisdiction, special terms
- Backend `chat.py` routes by `document_type`: NDA uses `ChatResponse` (full NDA schema); other documents use `GenericChatResponse` with per-document system prompts and tailored party labels (Provider/Customer, Covered Entity/Business Associate, etc.)
- `docConfig.ts` maps all 12 catalog entries to document type IDs, party labels, and NDA flag
- Chat asks exactly ONE question at a time for all document types
- PDF print timing fixed: uses `document.fonts.ready` promise, script at end of `<body>`
- Improved document preview panel contrast and paper shadow depth
- Jest test suite: 188 tests (mergeFields, NDAChat, DocumentChat, DocumentPreview, DocumentSelector, page, generateDocument, types)
- Backend pytest suite: 12 tests for chat endpoint (6 NDA + 6 generic document types)

### Current API Endpoints
- `POST /api/auth/signup` - Placeholder signup (always returns success)
- `POST /api/auth/signin` - Placeholder signin (always returns success + token)
- `POST /api/auth/signout` - Placeholder signout
- `GET /api/auth/me` - Returns null user
- `GET /api/health` - Health check
- `POST /api/chat/message` - AI chat: accepts `{messages, current_fields, document_type}`, returns `ChatResponse` (NDA) or `GenericChatResponse` (all other document types) with assistant message and extracted fields

### Key Frontend Files
- `frontend/lib/docConfig.ts` - Document type registry (12 entries with IDs, labels, NDA flag)
- `frontend/lib/types.ts` - `NDAFormData`, `GenericDocFormData`, `ExtractedNDAFields`, `ExtractedGenericFields`
- `frontend/lib/mergeFields.ts` - `mergeNDAFields`, `mergeGenericFields` (null-safe field merge)
- `frontend/lib/chatApi.ts` - Generic `sendChatMessage<T>` with `document_type` param
- `frontend/components/DocumentSelector.tsx` - Catalog grid, triggers document selection
- `frontend/components/DocumentChat.tsx` - Generic AI chat for non-NDA documents
- `frontend/components/DocumentPreview.tsx` - Generic cover-page preview for non-NDA documents
- `frontend/components/NDAChat.tsx` - Full NDA-specific AI chat
- `frontend/components/NDAPreview.tsx` - Full NDA-specific document preview
- `frontend/lib/generateDocument.ts` - PDF/markdown generators for both NDA and generic docs
