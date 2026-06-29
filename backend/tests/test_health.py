from fastapi.testclient import TestClient

from app.main import create_app


def test_health_returns_configured_services() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/health")

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

