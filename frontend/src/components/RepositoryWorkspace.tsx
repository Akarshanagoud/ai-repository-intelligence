import { useState } from "react";
import { FileCode2, FolderGit2, Play, RefreshCw } from "lucide-react";

import { useRepositories } from "../hooks/useRepositories";
import type { RepositorySummary } from "../types/repositories";

export function RepositoryWorkspace() {
  const {
    error,
    loading,
    repositories,
    scanning,
    selectedRepository,
    refresh,
    selectRepository,
    submitScan,
  } = useRepositories();
  const [source, setSource] = useState("");
  const [name, setName] = useState("");

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[0.9fr_1.4fr]">
      <div className="min-w-0 rounded border border-line bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <FolderGit2 className="h-5 w-5 shrink-0 text-signal" />
            <h2 className="truncate text-xl font-semibold">Repository Scanner</h2>
          </div>
          <button
            aria-label="Refresh repositories"
            className="rounded border border-line p-2 text-slate-600 hover:bg-panel"
            onClick={() => void refresh()}
            type="button"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (source.trim()) {
              void submitScan(source.trim(), name.trim() || undefined);
            }
          }}
        >
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Git URL or local path</span>
            <input
              className="mt-2 w-full rounded border border-line px-3 py-2 text-sm outline-none focus:border-signal"
              onChange={(event) => setSource(event.target.value)}
              placeholder="https://github.com/owner/repo.git"
              value={source}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Display name</span>
            <input
              className="mt-2 w-full rounded border border-line px-3 py-2 text-sm outline-none focus:border-signal"
              onChange={(event) => setName(event.target.value)}
              placeholder="Optional"
              value={name}
            />
          </label>
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded bg-signal px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!source.trim() || scanning}
            type="submit"
          >
            <Play className="h-4 w-4" />
            {scanning ? "Scanning" : "Scan Repository"}
          </button>
        </form>

        {error ? (
          <div className="mt-4 rounded border border-berry/30 bg-rose-50 p-3 text-sm text-berry">{error}</div>
        ) : null}

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="rounded border border-line bg-panel p-3 text-sm text-slate-600">Loading repositories</div>
          ) : repositories.length === 0 ? (
            <div className="rounded border border-line bg-panel p-3 text-sm text-slate-600">No repositories scanned yet</div>
          ) : (
            repositories.map((repository) => (
              <RepositoryListItem
                active={selectedRepository?.id === repository.id}
                key={repository.id}
                onClick={() => void selectRepository(repository.id)}
                repository={repository}
              />
            ))
          )}
        </div>
      </div>

      <div className="min-w-0 rounded border border-line bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <FileCode2 className="h-5 w-5 text-signal" />
          <h2 className="truncate text-xl font-semibold">Scan Results</h2>
        </div>

        {selectedRepository ? (
          <div className="mt-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Files" value={String(selectedRepository.file_count)} />
              <Metric label="Size" value={formatBytes(selectedRepository.total_bytes)} />
              <Metric label="Status" value={selectedRepository.status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedRepository.languages.map((language) => (
                <span className="rounded border border-line bg-panel px-2 py-1 text-xs font-semibold" key={language}>
                  {language}
                </span>
              ))}
            </div>

            <div className="mt-5 max-h-96 overflow-auto rounded border border-line">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="bg-panel text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Path</th>
                    <th className="px-3 py-2">Language</th>
                    <th className="px-3 py-2">Lines</th>
                    <th className="px-3 py-2">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRepository.files.map((file) => (
                    <tr className="border-t border-line" key={file.id}>
                      <td className="max-w-md truncate px-3 py-2 font-mono text-xs">{file.path}</td>
                      <td className="px-3 py-2">{file.language}</td>
                      <td className="px-3 py-2">{file.line_count}</td>
                      <td className="px-3 py-2">{formatBytes(file.size_bytes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded border border-line bg-panel p-4 text-sm text-slate-600">
            Scan a repository to see file metadata, languages, and the first 200 files.
          </div>
        )}
      </div>
    </section>
  );
}

function RepositoryListItem({
  active,
  onClick,
  repository,
}: {
  active: boolean;
  onClick: () => void;
  repository: RepositorySummary;
}) {
  return (
    <button
      className={`w-full rounded border p-3 text-left ${
        active ? "border-signal bg-emerald-50" : "border-line bg-white hover:bg-panel"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{repository.name}</div>
          <div className="mt-1 truncate text-xs text-slate-500">{repository.source}</div>
        </div>
        <span className="shrink-0 rounded bg-panel px-2 py-1 text-xs font-semibold">{repository.status}</span>
      </div>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line bg-panel p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 break-words text-lg font-semibold">{value}</div>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
