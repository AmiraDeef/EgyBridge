import api, { extractErrorMessage } from "./axiosInstance";

// POST /api/user/emergency/sos — auth required, multipart/form-data
// Pass a FormData instance built by the caller (so it can include an
// optional file under the "media" field alongside lat/lng/etc.).
export async function triggerSos(formData) {
  try {
    const { data } = await api.post("/emergency/sos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not send your SOS. Please try again or call local emergency services directly.") };
  }
}

// GET /api/user/emergency/my-incidents — auth required
export async function getMyIncidents() {
  try {
    const { data } = await api.get("/emergency/my-incidents");
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load your incident history.") };
  }
}
