import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useApi
 * Wraps any of the src/api/*.js functions (which all return either
 * { data } or { error } — never throw) and gives a component back a
 * consistent { data, loading, error, refetch } shape.
 *
 * Usage:
 *   const { data: trips, loading, error, refetch } = useApi(getAllTrips);
 *   const { data: trip } = useApi(() => getTripById(id), [id]);
 *
 * `deps` works like useEffect's dependency array — the request re-fires
 * when any dependency changes (e.g. an :id from the route).
 */
export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Avoids setting state after the component/effect has been superseded by
  // a newer request (e.g. the id in deps changed again before this one
  // resolved) — a common source of "stale data flashes in" bugs.
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    const result = await apiFn();

    if (requestId !== requestIdRef.current) return; // superseded — ignore

    if (result?.error) {
      setError(result.error);
      setData(null);
    } else {
      setData(result?.data ?? null);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
