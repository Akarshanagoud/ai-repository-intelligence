from datetime import datetime

from pydantic import BaseModel, Field


class RepositoryCreate(BaseModel):
    source: str = Field(min_length=1, description="Git URL or local path available to the backend")
    name: str | None = Field(default=None, max_length=255)


class RepositorySummary(BaseModel):
    id: int
    name: str
    source: str
    status: str
    file_count: int
    total_bytes: int
    languages: list[str]
    last_error: str | None
    created_at: datetime
    updated_at: datetime


class RepositoryFileRead(BaseModel):
    id: int
    path: str
    extension: str
    language: str
    size_bytes: int
    line_count: int


class RepositoryDetail(RepositorySummary):
    files: list[RepositoryFileRead]


class RepositoryScanResult(BaseModel):
    repository: RepositorySummary
    message: str
