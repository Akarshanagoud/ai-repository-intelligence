import httpx
import pytest

from app.main import create_app


@pytest.mark.asyncio
async def test_health_returns_configured_services() -> None:
    transport = httpx.ASGITransport(app=create_app())

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["app"] == "AI Repository Intelligence Platform"
    assert {service["name"] for service in payload["services"]} == {
        "postgresql",
        "redis",
        "neo4j",
        "qdrant",
        "ollama",
    }
