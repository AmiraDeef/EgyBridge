import api, { extractErrorMessage } from "./axiosInstance";
// POST /api/user/reviews — auth required
// Accepts either a pre-built FormData (from TripReviews.jsx) or a plain object.
export async function createReview(formDataOrFields) {
  try {
    let formData;
    if (formDataOrFields instanceof FormData) {
      // Caller already built the FormData (e.g. TripReviews.jsx) — use it directly
      formData = formDataOrFields;
    } else {
      // Legacy plain-object call path — build FormData here
      const { trip, rating, comment, mediaFile } = formDataOrFields;
      formData = new FormData();
      // Only append trip when it's a valid 24-char hex ObjectId
      if (trip && /^[0-9a-fA-F]{24}$/.test(trip)) {
        formData.append("trip", trip);
      }
      formData.append("rating", rating);
      formData.append("comment", comment);
      if (mediaFile) {
        formData.append("media", mediaFile);
      }
    }

    const { data } = await api.post("/reviews", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not submit your review.") };
  }
}

// GET /api/user/reviews/:tripId — public
export async function getTripReviews(tripId) {
  try {
    const { data } = await api.get(`/reviews/${tripId}`);
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load reviews.") };
  }
}
export async function getAllReviews() {
  try {
    const { data } = await api.get("/reviews");
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load all reviews.") };
  }
}
