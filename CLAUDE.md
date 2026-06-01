# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The current implementation has real authentication (bcrypt + JWT), a full AI-powered document drafting interface supporting all 12 Common Paper document types, and per-user document history. Users sign up or sign in, select a document from a catalog grid, then chat with an AI assistant that collects field values conversationally using a single structured-output LLM call (Cerebras via OpenRouter). The document preview updates automatically after each exchange. Users can save drafts, retrieve them from the selector screen, and export completed documents as PDF or markdown.

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
The database should use SQLite and be created from scratch each time the Docker container is brought up, with a `users` table and a `documents` table. `JWT_SECRET` must be set in `.env` for tokens to survive container restarts.  
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

### Completed (PL-8)
- Real signup/signin: bcrypt password hashing, 30-day JWT tokens, 409 on duplicate email, 401 on wrong password
- `JWT_SECRET` in `.env` keeps tokens valid across container restarts
- `documents` table in SQLite; fresh each container start (by design)
- `POST /api/documents` — save a draft (authenticated)
- `GET /api/documents` — list user's drafts (authenticated)
- `GET /api/documents/{id}` — retrieve full draft fields + chat history (authenticated)
- `PUT /api/documents/{id}` — update an existing draft (authenticated)
- **Save Draft** button in workspace header; first click creates, subsequent clicks update
- **My Saved Drafts** panel above the catalog grid; clicking a draft fully restores form fields and chat history
- `SessionExpiredError` thrown on 401 from all document API calls; app redirects to `/login` immediately
- Chat message state lifted to `page.tsx` so full conversation is saved/restored with each draft
- Sign-out button and user email shown in header (selector screen)
- Draft disclaimer amber banner on all preview screens (hidden when printing); disclaimer prepended to markdown exports
- Auth placeholder notice removed from login page; real error messages surfaced
- Backend pytest suite: 31 tests (9 auth, 10 documents, 12 chat)
- Frontend Jest suite: 209 tests

### Current API Endpoints
- `POST /api/auth/signup` - Real signup: bcrypt hash, insert user, return JWT. 409 on duplicate email
- `POST /api/auth/signin` - Real signin: verify bcrypt hash, return JWT. 401 on mismatch
- `POST /api/auth/signout` - Stateless signout (client drops token)
- `GET /api/auth/me` - Returns `{user: {id, email}}` for authenticated user
- `GET /api/health` - Health check
- `POST /api/chat/message` - AI chat: accepts `{messages, current_fields, document_type}`, returns `ChatResponse` (NDA) or `GenericChatResponse` (all other types)
- `POST /api/documents` - Save a draft (requires Bearer token)
- `GET /api/documents` - List authenticated user's drafts
- `GET /api/documents/{id}` - Get full draft (ownership enforced; 404 if not owner)
- `PUT /api/documents/{id}` - Update draft (ownership enforced)

### Key Backend Files
- `backend/prelegal/auth.py` - `hash_password`, `verify_password`, `create_access_token`, `decode_access_token`
- `backend/prelegal/dependencies.py` - `get_current_user` FastAPI dependency (parses `Authorization: Bearer`)
- `backend/prelegal/database.py` - SQLite init; drops and recreates `users` + `documents` on every startup
- `backend/prelegal/routes/auth.py` - Auth routes
- `backend/prelegal/routes/chat.py` - AI chat route with per-document-type system prompts
- `backend/prelegal/routes/documents.py` - Draft CRUD routes

### Key Frontend Files
- `frontend/lib/authApi.ts` - `getToken`/`setToken`/`clearToken`, `signin`, `signup`, `signout`
- `frontend/lib/documentsApi.ts` - `saveDraft`, `updateDraft`, `listDrafts`, `getDraft`; throws `SessionExpiredError` on 401
- `frontend/lib/docConfig.ts` - Document type registry (12 entries with IDs, labels, NDA flag)
- `frontend/lib/types.ts` - `NDAFormData`, `GenericDocFormData`, `DraftMeta`, `DraftFull`, `SaveDraftPayload`
- `frontend/lib/mergeFields.ts` - `mergeNDAFields`, `mergeGenericFields` (null-safe field merge)
- `frontend/lib/chatApi.ts` - `sendChatMessage<T>` with Bearer auth header
- `frontend/app/page.tsx` - Main page: auth gate, document selector, workspace, save/restore draft logic
- `frontend/components/DocumentSelector.tsx` - Catalog grid + My Saved Drafts panel
- `frontend/components/DocumentChat.tsx` - Generic AI chat (messages prop controlled by page.tsx)
- `frontend/components/DocumentPreview.tsx` - Generic cover-page preview with disclaimer banner
- `frontend/components/NDAChat.tsx` - Full NDA-specific AI chat (messages prop controlled by page.tsx)
- `frontend/components/NDAPreview.tsx` - Full NDA-specific document preview with disclaimer banner
- `frontend/lib/generateDocument.ts` - PDF/markdown generators; draft disclaimer in markdown exports
