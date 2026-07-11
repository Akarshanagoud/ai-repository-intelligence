import type { HealthResponse } from "../types/health";
import type { RepositoryDetail, RepositoryScanResult, RepositorySummary } from "../types/repositories";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Health request failed with status ${response.status}`);
  }

  return response.json() as Promise<HealthResponse>;
}

export async function fetchRepositories(): Promise<RepositorySummary[]> {
  const response = await fetch(`${API_BASE_URL}/repositories`);

  if (!response.ok) {
    throw new Error(`Repository request failed with status ${response.status}`);
  }

  return response.json() as Promise<RepositorySummary[]>;
}

export async function fetchRepository(repositoryId: number): Promise<RepositoryDetail> {
  const response = await fetch(`${API_BASE_URL}/repositories/${repositoryId}`);

  if (!response.ok) {
    throw new Error(`Repository detail request failed with status ${response.status}`);
  }

  return response.json() as Promise<RepositoryDetail>;
}

export async function scanRepository(source: string, name?: string): Promise<RepositoryScanResult> {
  const response = await fetch(`${API_BASE_URL}/repositories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, name: name || undefined }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(payload?.detail ?? `Repository scan failed with status ${response.status}`);
  }

  return response.json() as Promise<RepositoryScanResult>;
}
