import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function createReservation(payload) {
  const res = await axios.post(`${API_BASE}/api/reservations`, payload);
  return res.data?.data;
}

export async function fetchGuestTrips(clerkId) {
  const res = await axios.get(`${API_BASE}/api/trips`, {
    params: { clerk_id: clerkId },
  });

  return res.data?.data || [];
}

export async function fetchReservationDetails(id, clerkId = null) {
  const params = clerkId ? { clerk_id: clerkId } : {};

  const res = await axios.get(`${API_BASE}/api/reservations/${id}`, {
    params,
  });

  return res.data?.data;
}

export async function cancelReservation(id, clerkId) {
  const res = await axios.patch(`${API_BASE}/api/reservations/${id}/cancel`, {
    clerk_id: clerkId,
  });

  return res.data?.data;
}
