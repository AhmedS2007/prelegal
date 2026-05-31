# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The current implementation has a placeholder login screen and the Mutual NDA manual form with live preview and PDF/markdown export. AI chat is planned for a future ticket.

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

### Current API Endpoints
- `POST /api/auth/signup` - Placeholder signup (always returns success)
- `POST /api/auth/signin` - Placeholder signin (always returns success + token)
- `POST /api/auth/signout` - Placeholder signout
- `GET /api/auth/me` - Returns null user
- `GET /api/health` - Health check
