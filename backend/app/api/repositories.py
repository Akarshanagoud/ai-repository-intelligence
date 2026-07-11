import subprocess
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import get_settings
from app.db.session import get_db_session
from app.models import Repository, RepositoryFile
from app.schemas.repositories import (
    RepositoryCreate,
    RepositoryDetail,
    RepositoryFileRead,
    RepositoryScanResult,
    RepositorySummary,
)
from app.services.repository_scanner import (
    derive_repository_name,
    prepare_repository_source,
    scan_repository,
)

router = APIRouter(prefix="/repositories", tags=["repositories"])


@router.get("", response_model=list[RepositorySummary])
async def list_repositories(session: AsyncSession = Depends(get_db_session)) -> list[RepositorySummary]:
    result = await session.execute(select(Repository).order_by(Repository.updated_at.desc()))
    return [_to_summary(repository) for repository in result.scalars()]


@router.post("", response_model=RepositoryScanResult, status_code=201)
async def create_repository(
    payload: RepositoryCreate,
    session: AsyncSession = Depends(get_db_session),
) -> RepositoryScanResult:
    settings = get_settings()
    name = payload.name or derive_repository_name(payload.source)
    local_path = ""

    repository = await _get_repository_by_name(session, name)
    if repository is None:
        repository = Repository(name=name, source=payload.source, local_path="", status="scanning")
        session.add(repository)
    else:
        repository.source = payload.source
        repository.status = "scanning"
        repository.last_error = None

    await session.flush()

    try:
        source_path = prepare_repository_source(
            payload.source,
            Path(settings.repository_storage_path),
            name,
        )
        local_path = str(source_path)
        scan = scan_repository(source_path, settings.max_scan_file_size_bytes)

        await session.execute(delete(RepositoryFile).where(RepositoryFile.repository_id == repository.id))
        repository.local_path = local_path
        repository.status = "ready"
        repository.file_count = len(scan.files)
        repository.total_bytes = scan.total_bytes
        repository.languages = ",".join(scan.languages)
        repository.last_error = None
        session.add_all(
            RepositoryFile(
                repository_id=repository.id,
                path=file.path,
                extension=file.extension,
                language=file.language,
                size_bytes=file.size_bytes,
                line_count=file.line_count,
            )
            for file in scan.files
        )
    except (OSError, subprocess.SubprocessError, ValueError) as exc:
        repository.local_path = local_path
        repository.status = "failed"
        repository.last_error = str(exc)
        await session.commit()
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    await session.commit()
    await session.refresh(repository)

    return RepositoryScanResult(
        repository=_to_summary(repository),
        message=f"Scanned {repository.file_count} files.",
    )


@router.get("/{repository_id}", response_model=RepositoryDetail)
async def get_repository(
    repository_id: int,
    session: AsyncSession = Depends(get_db_session),
) -> RepositoryDetail:
    result = await session.execute(
        select(Repository)
        .where(Repository.id == repository_id)
        .options(selectinload(Repository.files))
    )
    repository = result.scalar_one_or_none()
    if repository is None:
        raise HTTPException(status_code=404, detail="Repository not found")

    return RepositoryDetail(
        **_to_summary(repository).model_dump(),
        files=[
            RepositoryFileRead(
                id=file.id,
                path=file.path,
                extension=file.extension,
                language=file.language,
                size_bytes=file.size_bytes,
                line_count=file.line_count,
            )
            for file in sorted(repository.files, key=lambda item: item.path)[:200]
        ],
    )


async def _get_repository_by_name(session: AsyncSession, name: str) -> Repository | None:
    result = await session.execute(select(Repository).where(Repository.name == name))
    return result.scalar_one_or_none()


def _to_summary(repository: Repository) -> RepositorySummary:
    return RepositorySummary(
        id=repository.id,
        name=repository.name,
        source=repository.source,
        status=repository.status,
        file_count=repository.file_count,
        total_bytes=repository.total_bytes,
        languages=[language for language in repository.languages.split(",") if language],
        last_error=repository.last_error,
        created_at=repository.created_at,
        updated_at=repository.updated_at,
    )
