import os
import sqlite3
from pathlib import Path

_DEFAULT_DB = str(Path(__file__).parents[2] / "prelegal.db")


def _db_path() -> str:
    return os.environ.get("DB_PATH", _DEFAULT_DB)


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_connection()
    try:
        c = conn.cursor()
        c.executescript("""
            DROP TABLE IF EXISTS documents;
            DROP TABLE IF EXISTS users;
            CREATE TABLE users (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                email           TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE documents (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                document_type TEXT NOT NULL,
                doc_name      TEXT NOT NULL DEFAULT 'Untitled',
                form_data     TEXT NOT NULL DEFAULT '{}',
                chat_messages TEXT NOT NULL DEFAULT '[]',
                created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX idx_documents_user_id ON documents(user_id);
        """)
        conn.commit()
    finally:
        conn.close()
