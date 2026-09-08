import api, { extractErrorMessage } from "./axiosInstance";
// POST /api/user/reviews — auth required
export async function createReview({ trip, rating, comment, mediaFile }) {
  try {
    const formData = new FormData();
    formData.append("trip", trip);
    formData.append("rating", rating);
    formData.append("comment", comment);
    
    // ➕ لو فيه ملف مختار بنضيفه للـ FormData بنفس اسم الحقل اللي في Multer ("media")
    if (mediaFile) {
      formData.append("media", mediaFile);
    }

    const { data } = await api.post("/reviews", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
