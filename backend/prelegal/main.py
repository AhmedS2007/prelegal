import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse, HTMLResponse

from .database import init_db
from .routes.auth import router as auth_router

STATIC_DIR = Path(os.environ.get("STATIC_DIR", Path(__file__).parents[2] / "frontend" / "out")).resolve()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(auth_router, prefix="/api/auth")


@app.get("/api/health")
async def health():
    return {"status": "ok"}


def _safe_file(path: str) -> Path | None:
    for candidate in (
        STATIC_DIR / path,
        STATIC_DIR / f"{path}.html",
        STATIC_DIR / path / "index.html",
    ):
        try:
            resolved = candidate.resolve()
            if resolved.is_file() and resolved.is_relative_to(STATIC_DIR):
                return resolved
        except (OSError, ValueError):
            continue
    return None


@app.get("/{path:path}")
async def serve_frontend(path: str = ""):
    if not STATIC_DIR.exists():
        return HTMLResponse(
            "<h1>Frontend not built</h1><p>Run <code>npm run build</code> in <code>frontend/</code>.</p>",
            status_code=503,
        )

    if path:
        safe = _safe_file(path)
        if safe:
            return FileResponse(str(safe))

    index = STATIC_DIR / "index.html"
    if index.is_file():
        return FileResponse(str(index))

    return HTMLResponse("<h1>Not Found</h1>", status_code=404)
