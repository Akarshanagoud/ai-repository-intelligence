# Milestone 2: Repository Ingestion

Milestone 2 turns the platform shell into a usable repository metadata scanner.

## Implemented

- Repository registration from a public Git URL or backend-visible local path.
- Shallow Git cloning inside the backend container.
- File scanning with ignored directories for `.git`, `node_modules`, caches, virtualenvs, and build output.
- Language detection from common file extensions.
- File size, line count, extension, and path metadata extraction.
- PostgreSQL persistence for repositories and repository files.
- FastAPI endpoints:
  - `GET /api/v1/repositories`
  - `POST /api/v1/repositories`
  - `GET /api/v1/repositories/{repository_id}`
- React dashboard controls for scanning repositories and viewing results.

## Verified

- Local backend tests, linting, and type checking.
- Frontend production build.
- Docker Compose rebuild and startup.
- End-to-end scan of `/app/app`, producing 28 Python files in PostgreSQL.

## Next

- Move scanning into Redis-backed background jobs.
- Add Tree-sitter parsing for symbols, imports, classes, and functions.
- Write code relationships into Neo4j.
- Generate embeddings and store semantic chunks in Qdrant.
