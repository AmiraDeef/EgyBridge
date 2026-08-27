import api, { extractErrorMessage } from "./axiosInstance";

// GET /api/user/places?category=... — public
export async function getAllPlaces(category) {
  try {
    const { data } = await api.get("/places", { params: category ? { category } : {} });
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load places.") };
  }
}

// GET /api/user/places/:id — public
export async function getPlaceById(id) {
  try {
    const { data } = await api.get(`/places/${id}`);
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load this place.") };
  }
}

// GET /api/user/places/:id/context — public — IA Section 4 data
export async function getPlaceContext(id) {
  try {
    const { data } = await api.get(`/places/${id}/context`);
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load place details.") };
  }
}
