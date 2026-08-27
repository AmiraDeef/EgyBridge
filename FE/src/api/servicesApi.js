import api, { extractErrorMessage } from "./axiosInstance";

// GET /api/user/services?category=visa&verifiedOnly=true — public
export async function getAllServices({ category, verifiedOnly } = {}) {
  try {
    const params = {};
    if (category) params.category = category;
    if (verifiedOnly) params.verifiedOnly = "true";
    const { data } = await api.get("/services", { params });
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load services.") };
  }
}

// GET /api/user/services/:id — public
export async function getServiceById(id) {
  try {
    const { data } = await api.get(`/services/${id}`);
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load this service.") };
  }
}
