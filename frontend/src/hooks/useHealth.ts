import { useEffect, useState } from "react";

import { fetchHealth } from "../services/api";
import type { HealthResponse } from "../types/health";

export function useHealth() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchHealth()
      .then((health) => {
        if (active) {
          setData(health);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setError("Backend health endpoint is unavailable");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}

