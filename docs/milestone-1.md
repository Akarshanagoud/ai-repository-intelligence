# Milestone 1: Local Enterprise Foundation

Milestone 1 establishes the deployable skeleton for the AI Repository Intelligence Platform.

## Free Tool Selection

FastAPI, React, PostgreSQL, Redis, Neo4j Community, Qdrant, and Ollama were selected because each can run locally, has a strong open-source ecosystem, and maps directly to future enterprise features without requiring paid APIs or managed cloud services.

## Runtime Boundaries

- The backend owns API contracts, orchestration, settings, and future repository intelligence workflows.
- The worker process is separated from the API so expensive ingestion and parsing jobs do not block requests.
- PostgreSQL is the durable source for relational metadata.
- Redis is the async coordination layer.
- Neo4j stores graph relationships that are awkward to query relationally.
- Qdrant stores vector embeddings for semantic retrieval.
- Ollama keeps LLM inference local.
- The frontend is a typed dashboard shell that can grow page by page.

## Next Milestone

Milestone 2 should add JWT authentication, organizations, users, roles, and repository-level permissions.

