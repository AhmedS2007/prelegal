import os

import pytest

from prelegal.database import init_db


@pytest.fixture(autouse=True)
def fresh_db(tmp_path):
    db_path = str(tmp_path / "test_prelegal.db")
    os.environ["DB_PATH"] = db_path
    init_db()
    yield
    del os.environ["DB_PATH"]
