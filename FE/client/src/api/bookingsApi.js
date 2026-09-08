import api, { extractErrorMessage } from "./axiosInstance";

// POST /api/user/bookings — auth required
export async function createBooking({ trip, seats }) {
  try {
    const { data } = await api.post("/bookings", { trip, seats });
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not complete the booking.") };
  }
}

// GET /api/user/bookings — auth required (the caller's own bookings)
export async function getMyBookings() {
  try {
    const { data } = await api.get("/bookings");
    return { data };
  } catch (error) {
    return { error: extractErrorMessage(error, "Could not load your bookings.") };
  }
}

// PATCH /api/user/bookings/:id/cancel — auth required
export async function cancelBooking(id) {
  try {
    const response = await api.patch(`/user/bookings/${id}/cancel`);
    return { data: response.data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error.response?.data?.message || "Could not cancel this booking." 
    };
  }
}
