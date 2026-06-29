from pydantic import BaseModel


class ServiceDescriptor(BaseModel):
    name: str
    kind: str
    url: str


class HealthResponse(BaseModel):
    status: str
    app: str
    environment: str
    services: list[ServiceDescriptor]

