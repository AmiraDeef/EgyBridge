import api, { extractErrorMessage } from "./axiosInstance";

// POST /api/user/reviews — auth required
export async function createReview({ trip, rating, comment }) {
  try {
    const { data } = await api.post("/reviews", { trip, rating, comment });
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
