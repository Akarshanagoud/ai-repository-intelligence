import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";

import type { ServiceDescriptor } from "../types/health";

export function ServiceStatusGrid({
  error,
  loading,
  services,
}: {
  error: string | null;
  loading: boolean;
  services: ServiceDescriptor[];
}) {
  if (loading) {
    return (
      <div className="mt-6 flex items-center gap-3 rounded border border-line bg-panel p-4 text-sm text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking backend service catalog
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 flex items-center gap-3 rounded border border-berry/30 bg-rose-50 p-4 text-sm text-berry">
        <CircleAlert className="h-4 w-4" />
        {error}
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-3 md:grid-cols-2">
      {services.map((service) => (
        <div className="min-w-0 overflow-hidden rounded border border-line p-4" key={service.name}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold capitalize">{service.name}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">{service.kind}</div>
            </div>
            <CircleCheck className="h-5 w-5 shrink-0 text-signal" />
          </div>
          <div className="mt-4 max-w-full truncate rounded bg-panel px-3 py-2 font-mono text-xs text-slate-600">
            {service.url}
          </div>
        </div>
      ))}
    </div>
  );
}
