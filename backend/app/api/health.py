from fastapi import APIRouter

from app.core.config import get_settings
from app.schemas.health import HealthResponse, ServiceDescriptor

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="ok",
        app=settings.app_name,
        environment=settings.app_env,
        services=[
            ServiceDescriptor(name="postgresql", kind="metadata", url=settings.postgres_host),
            ServiceDescriptor(name="redis", kind="queue", url=settings.redis_url),
            ServiceDescriptor(name="neo4j", kind="graph", url=settings.neo4j_uri),
            ServiceDescriptor(name="qdrant", kind="vector", url=settings.qdrant_url),
            ServiceDescriptor(name="ollama", kind="llm", url=settings.ollama_url),
        ],
    )

