import api, { extractErrorMessage } from "./axiosInstance";

// GET /api/user/trips — public, no auth required (browsing tour packages)
export async function getAllTrips() {
  try {
    const { data } = await api.get("/trips");
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load trips.") };
  }
}

// GET /api/user/trips/:id — public
export async function getTripById(id) {
  try {
    const { data } = await api.get(`/trips/${id}`);
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load this trip.") };
  }
}

// POST /api/user/trips — auth required (admin content management)
export async function createTrip(payload) {
  try {
    const { data } = await api.post("/trips", payload);
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not create the trip.") };
  }
}

// PUT /api/user/trips/:id — auth required
export async function updateTrip(id, payload) {
  try {
    const { data } = await api.put(`/trips/${id}`, payload);
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not update the trip.") };
  }
}

// DELETE /api/user/trips/:id — auth required
export async function deleteTrip(id) {
  try {
    const { data } = await api.delete(`/trips/${id}`);
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not delete the trip.") };
  }
}
