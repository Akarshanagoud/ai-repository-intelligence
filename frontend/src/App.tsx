import { Activity, Boxes, BrainCircuit, Database, GitBranch, Network, Server } from "lucide-react";

import { ServiceStatusGrid } from "./components/ServiceStatusGrid";
import { useHealth } from "./hooks/useHealth";

const capabilities = [
  { label: "Repository ingestion", status: "Milestone 3", icon: GitBranch },
  { label: "Code parsing", status: "Milestone 4", icon: Boxes },
  { label: "Knowledge graph", status: "Milestone 7", icon: Network },
  { label: "GraphRAG", status: "Milestone 8", icon: BrainCircuit },
];

export function App() {
  const { data, loading, error } = useHealth();

  return (
    <main className="min-h-screen bg-panel text-ink">
      <section className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-signal">Milestone 1</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal md:text-5xl">
              AI Repository Intelligence Platform
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Local-first foundation for repository ingestion, graph intelligence, semantic search,
              and private LLM-powered code understanding.
            </p>
          </div>
          <div className="grid min-w-72 grid-cols-2 gap-3 rounded border border-line bg-panel p-4">
            <Metric label="Backend" value={error ? "Offline" : loading ? "Checking" : "Online"} />
            <Metric label="Mode" value={data?.environment ?? "local"} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-signal" />
            <h2 className="text-xl font-semibold">Local Stack</h2>
          </div>
          <ServiceStatusGrid services={data?.services ?? []} loading={loading} error={error} />
        </div>

        <div className="rounded border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-amber" />
            <h2 className="text-xl font-semibold">Delivery Roadmap</h2>
          </div>
          <div className="mt-5 space-y-3">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <div className="flex items-center justify-between rounded border border-line p-3" key={capability.label}>
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="truncate text-sm font-medium">{capability.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{capability.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoPanel icon={<Database className="h-5 w-5" />} title="Metadata">
            PostgreSQL is reserved for repositories, files, code symbols, users, organizations, and audit data.
          </InfoPanel>
          <InfoPanel icon={<Network className="h-5 w-5" />} title="Relationships">
            Neo4j will model dependencies, imports, call chains, ownership, and API exposure.
          </InfoPanel>
          <InfoPanel icon={<BrainCircuit className="h-5 w-5" />} title="Local AI">
            Qdrant and Ollama keep embeddings and language model inference on local infrastructure.
          </InfoPanel>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line bg-white p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}

function InfoPanel({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded border border-line bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3 text-signal">
        {icon}
        <h3 className="font-semibold text-ink">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{children}</p>
    </div>
  );
}

