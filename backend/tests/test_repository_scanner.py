from pathlib import Path

import pytest

from app.services.repository_scanner import derive_repository_name, scan_repository


def test_derive_repository_name_from_git_url() -> None:
    assert derive_repository_name("https://github.com/example/Some Repo.git") == "some-repo"


def test_scan_repository_counts_files_and_languages(tmp_path: Path) -> None:
    (tmp_path / ".git").mkdir()
    (tmp_path / ".git" / "config").write_text("ignored", encoding="utf-8")
    (tmp_path / "app").mkdir()
    (tmp_path / "app" / "main.py").write_text("print('hello')\n", encoding="utf-8")
    (tmp_path / "README.md").write_text("# Demo\n\nText\n", encoding="utf-8")
    (tmp_path / "large.json").write_text("x" * 200, encoding="utf-8")

    result = scan_repository(tmp_path, max_file_size_bytes=20)

    assert result.total_bytes > 0
    assert set(result.languages) == {"Markdown", "Python"}
    assert {file.path for file in result.files} == {"README.md", "app/main.py"}


def test_scan_repository_includes_code_under_size_limit(tmp_path: Path) -> None:
    source = tmp_path / "main.py"
    source.write_text("a = 1\nb = 2\n", encoding="utf-8")

    result = scan_repository(tmp_path, max_file_size_bytes=100)

    assert len(result.files) == 1
    assert result.files[0].language == "Python"
    assert result.files[0].line_count == 2
    assert result.languages == ["Python"]


@pytest.mark.parametrize(
    ("source", "expected"),
    [
        ("git@github.com:owner/repo.git", "repo"),
        ("C:/work/My App", "my-app"),
        ("/tmp/repository", "repository"),
    ],
)
def test_derive_repository_name_normalizes_sources(source: str, expected: str) -> None:
    assert derive_repository_name(source) == expected
