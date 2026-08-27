import { useCallback, useState } from "react";

const STORAGE_KEY = "egi_rise_planning_draft";

const DEFAULT_DRAFT = {
  duration: 3,
  startDate: null,
  endDate: null,
  interests: [],
  companion: null,
  destinations: [],
  budget: 800,
  selectedPlaceIds: [],
  tripPlanId: null, // set once Step 4 successfully calls generateTripPlan
};

function readDraft() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_DRAFT, ...JSON.parse(raw) } : DEFAULT_DRAFT;
  } catch {
    return DEFAULT_DRAFT;
  }
}

/**
 * usePlanningDraft
 * The Start Planning wizard spans several routes (/plan, /plan/places,
 * /plan/review, /plan/offline), each its own page/component — so wizard
 * state can't just live in one component's useState. sessionStorage is a
 * lightweight way to carry it between steps without standing up a full
 * context provider, and it naturally clears itself when the tab closes
 * rather than lingering like localStorage would.
 */
export function usePlanningDraft() {
  const [draft, setDraft] = useState(readDraft);

  const updateDraft = useCallback((patch) => {
    setDraft((prev) => {
      const next = { ...prev, ...(typeof patch === "function" ? patch(prev) : patch) };
      // Written synchronously here, not in a useEffect keyed on `draft`:
      // callers commonly do updateDraft(...) immediately followed by
      // navigate(...) in the same handler (see PlanningStep4Itinerary's
      // onSaved). If persistence only happened in a useEffect, React can
      // batch the state update with the route change and unmount this
      // component before that effect ever fires — silently losing the
      // write. Writing here guarantees it happens before navigate() runs.
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetDraft = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setDraft(DEFAULT_DRAFT);
  }, []);

  return { draft, updateDraft, resetDraft };
}
