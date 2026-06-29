# AI Repository Intelligence Platform

An enterprise-grade, free and open-source foundation for ingesting, parsing, searching, visualizing, and explaining software repositories with local infrastructure only.

This repository currently implements **Milestone 1**: the project structure, local Docker Compose deployment, FastAPI backend, React/Vite frontend shell, PostgreSQL, Redis, Neo4j Community, Qdrant, Ollama, and a worker placeholder.

## Architecture Decisions

- **FastAPI** powers the backend because it is typed, async-friendly, production-proven, and generates OpenAPI docs without paid tooling.
- **React, TypeScript, Vite, and Tailwind CSS** provide a fast frontend stack with strong typing and no paid services.
- **PostgreSQL** stores structured repository metadata such as repositories, files, functions, permissions, and audit events in later milestones.
- **Redis** supports background job queues and future rate limiting.
- **Neo4j Community Edition** stores repository knowledge graph nodes and relationships such as `CONTAINS`, `IMPORTS`, `CALLS`, and `DEPENDS_ON`.
- **Qdrant** provides an open-source vector database for local embedding search.
- **Ollama** runs local LLMs such as Qwen Coder, DeepSeek Coder, CodeLlama, Mistral, or Llama without paid APIs.
- **Docker Compose** gives a complete local enterprise deployment with no paid cloud dependency.

## Services

| Service | URL | Purpose |
| --- | --- | --- |
| Frontend | http://localhost:5173 | React dashboard shell |
| Backend API | http://localhost:8000 | FastAPI application |
| API docs | http://localhost:8000/docs | OpenAPI documentation |
| PostgreSQL | localhost:5432 | Structured metadata |
| Redis | localhost:6379 | Background job and cache backend |
| Neo4j Browser | http://localhost:7474 | Knowledge graph |
| Qdrant | http://localhost:6333/dashboard | Vector database |
| Ollama | http://localhost:11434 | Local LLM runtime |

## Quick Start

1. Copy environment defaults:

   ```bash
   cp .env.example .env
   ```

2. Start the local stack:

   ```bash
   docker compose up --build
   ```

3. Pull a local model for Ollama:

   ```bash
   docker compose exec ollama ollama pull qwen2.5-coder:7b
   ```

4. Verify the backend:

   ```bash
   curl http://localhost:8000/api/v1/health
   ```

## Local Development

Backend:

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -e ".[dev]"
pytest
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Milestone 1 Scope

Implemented:

- Production-oriented folder structure.
- FastAPI app with typed settings, CORS, health endpoint, and structured logging.
- React/TypeScript dashboard shell connected to backend health.
- Docker Compose services for backend, worker, frontend, PostgreSQL, Redis, Neo4j, Qdrant, and Ollama.
- Backend and frontend Dockerfiles.
- Basic tests and scripts.

Deferred to future milestones:

- Authentication and RBAC.
- Repository cloning and metadata extraction.
- Tree-sitter parsing.
- Embeddings, GraphRAG, and local LLM question answering.
- Security scanning and evaluation.

