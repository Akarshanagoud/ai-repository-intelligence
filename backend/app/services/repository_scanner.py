from __future__ import annotations

import shutil
import subprocess
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


LANGUAGE_BY_EXTENSION = {
    ".css": "CSS",
    ".dockerfile": "Dockerfile",
    ".go": "Go",
    ".html": "HTML",
    ".java": "Java",
    ".js": "JavaScript",
    ".json": "JSON",
    ".md": "Markdown",
    ".py": "Python",
    ".rs": "Rust",
    ".sh": "Shell",
    ".sql": "SQL",
    ".tsx": "TypeScript",
    ".ts": "TypeScript",
    ".toml": "TOML",
    ".yaml": "YAML",
    ".yml": "YAML",
}

IGNORED_DIRECTORIES = {
    ".git",
    ".mypy_cache",
    ".pytest_cache",
    ".ruff_cache",
    ".venv",
    "__pycache__",
    "dist",
    "node_modules",
}


@dataclass(frozen=True)
class ScannedFile:
    path: str
    extension: str
    language: str
    size_bytes: int
    line_count: int


@dataclass(frozen=True)
class ScanSummary:
    files: list[ScannedFile]
    languages: list[str]
    total_bytes: int


def derive_repository_name(source: str) -> str:
    parsed = urlparse(source)
    candidate = Path(parsed.path if parsed.scheme else source).name
    if candidate.endswith(".git"):
        candidate = candidate[:-4]
    return _normalize_name(candidate or "repository")


def prepare_repository_source(source: str, storage_root: Path, name: str) -> Path:
    storage_root.mkdir(parents=True, exist_ok=True)
    destination = storage_root / name

    if _looks_like_git_url(source):
        if destination.exists():
            shutil.rmtree(destination)
        subprocess.run(
            ["git", "clone", "--depth", "1", source, str(destination)],
            check=True,
            capture_output=True,
            text=True,
            timeout=300,
        )
        return destination

    source_path = Path(source).expanduser().resolve()
    if not source_path.exists() or not source_path.is_dir():
        raise ValueError("Source must be a Git URL or an existing directory path.")
    return source_path


def scan_repository(path: Path, max_file_size_bytes: int) -> ScanSummary:
    scanned_files: list[ScannedFile] = []
    total_bytes = 0
    language_counts: Counter[str] = Counter()

    for file_path in sorted(path.rglob("*")):
        if not file_path.is_file() or _is_ignored(file_path, path):
            continue

        size_bytes = file_path.stat().st_size
        if size_bytes > max_file_size_bytes:
            continue

        relative_path = file_path.relative_to(path).as_posix()
        extension = file_path.suffix.lower()
        language = _detect_language(file_path)
        line_count = _count_lines(file_path)

        scanned_files.append(
            ScannedFile(
                path=relative_path,
                extension=extension,
                language=language,
                size_bytes=size_bytes,
                line_count=line_count,
            )
        )
        total_bytes += size_bytes
        language_counts[language] += 1

    languages = [language for language, _ in language_counts.most_common()]
    return ScanSummary(files=scanned_files, languages=languages, total_bytes=total_bytes)


def _looks_like_git_url(source: str) -> bool:
    return source.startswith(("http://", "https://", "git@")) or source.endswith(".git")


def _normalize_name(value: str) -> str:
    normalized = "".join(character if character.isalnum() or character in "-_" else "-" for character in value)
    return normalized.strip("-_").lower() or "repository"


def _is_ignored(file_path: Path, root: Path) -> bool:
    relative_parts = file_path.relative_to(root).parts
    return any(part in IGNORED_DIRECTORIES for part in relative_parts)


def _detect_language(file_path: Path) -> str:
    if file_path.name == "Dockerfile":
        return "Dockerfile"
    return LANGUAGE_BY_EXTENSION.get(file_path.suffix.lower(), "Unknown")


def _count_lines(file_path: Path) -> int:
    try:
        with file_path.open("r", encoding="utf-8", errors="ignore") as handle:
            return sum(1 for _ in handle)
    except OSError:
        return 0
