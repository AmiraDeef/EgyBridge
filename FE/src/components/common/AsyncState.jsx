import React from "react";
import { Loader2, AlertCircle, Inbox, RefreshCw } from "lucide-react";

/**
 * AsyncState
 * Wraps a page/section's data-dependent content so Loading, Error, and
 * Empty states are handled consistently everywhere, instead of each page
 * reinventing its own spinner/error text/blank-screen behavior.
 *
 * Usage:
 *   const { data: trips, loading, error, refetch } = useApi(getAllTrips);
 *
 *   <AsyncState
 *     loading={loading}
 *     error={error}
 *     data={trips}
 *     onRetry={refetch}
 *     isEmpty={(d) => !d || d.length === 0}
 *     emptyMessage="No trips available yet — check back soon."
 *   >
 *     {(trips) => trips.map((t) => <TripCard key={t._id} trip={t} />)}
 *   </AsyncState>
 */
export default function AsyncState({
  loading,
  error,
  data,
  onRetry,
  isEmpty = (d) => !d || (Array.isArray(d) && d.length === 0),
  emptyMessage = "Nothing here yet.",
  loadingLabel = "Loading…",
  children,
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-charcoal/50">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
        <p className="text-sm">{loadingLabel}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 py-12 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="max-w-sm text-sm font-medium text-red-600">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </button>
        )}
      </div>
    );
  }

  if (isEmpty(data)) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-sand-line py-16 text-center text-charcoal/50">
        <Inbox className="h-6 w-6" />
        <p className="max-w-sm text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return children(data);
}
