import { useCallback, useEffect, useState } from "react";

import { fetchRepositories, fetchRepository, scanRepository } from "../services/api";
import type { RepositoryDetail, RepositorySummary } from "../types/repositories";

export function useRepositories() {
  const [repositories, setRepositories] = useState<RepositorySummary[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<RepositoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const nextRepositories = await fetchRepositories();
      setRepositories(nextRepositories);
      setError(null);
      if (nextRepositories.length > 0) {
        const detail = await fetchRepository(nextRepositories[0].id);
        setSelectedRepository(detail);
      } else {
        setSelectedRepository(null);
      }
    } catch {
      setError("Repository API is unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const selectRepository = useCallback(async (repositoryId: number) => {
    try {
      const detail = await fetchRepository(repositoryId);
      setSelectedRepository(detail);
      setError(null);
    } catch {
      setError("Unable to load repository details");
    }
  }, []);

  const submitScan = useCallback(
    async (source: string, name?: string) => {
      setScanning(true);
      try {
        const result = await scanRepository(source, name);
        await refresh();
        await selectRepository(result.repository.id);
        setError(null);
      } catch (scanError) {
        setError(scanError instanceof Error ? scanError.message : "Repository scan failed");
      } finally {
        setScanning(false);
      }
    },
    [refresh, selectRepository],
  );

  return {
    error,
    loading,
    repositories,
    scanning,
    selectedRepository,
    refresh,
    selectRepository,
    submitScan,
  };
}
