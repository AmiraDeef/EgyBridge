import api, { extractErrorMessage } from "./axiosInstance";

// POST /api/user/trip-plans/generate — auth required
export async function generateTripPlan({ title, budget, duration, interests, destinations }) {
  try {
    const { data } = await api.post("/trip-plans/generate", {
      title,
      budget,
      duration,
      interests,
      destinations,
    });
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not generate your trip plan.") };
  }
}

// GET /api/user/trip-plans/my-trip — auth required
export async function getMyTrip() {
  try {
    const { data } = await api.get("/trip-plans/my-trip");
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load your trip.") };
  }
}

// GET /api/user/trip-plans — auth required
export async function getMyTripPlans() {
  try {
    const { data } = await api.get("/trip-plans");
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load your trip plans.") };
  }
}

// PATCH /api/user/trip-plans/:id/itinerary — auth required
export async function updateItinerary(id, itinerary) {
  try {
    const { data } = await api.patch(`/trip-plans/${id}/itinerary`, { itinerary });
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not save your changes.") };
  }
}

// GET /api/user/trip-plans/:id/offline-pack — auth required
export async function getOfflinePack(id) {
  try {
    const { data } = await api.get(`/trip-plans/${id}/offline-pack`);
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not download the offline pack.") };
  }
}
