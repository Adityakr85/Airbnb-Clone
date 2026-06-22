import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function createReservation(payload) {
  try {
    const res = await axios.post(`${API_BASE}/api/reservations`, payload);
    return res.data?.data;
  } catch (error) {
    console.error("Failed to create reservation:", error);
    throw error;
  }
}

export async function fetchGuestTrips(clerkId) {
  try {
    const res = await axios.get(`${API_BASE}/api/trips`, {
      params: { clerk_id: clerkId }
    });
    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch guest trips:", error);
    throw error;
  }
}

export async function fetchReservationDetails(id) {
  try {
    const res = await axios.get(`${API_BASE}/api/reservations/${id}`);
    return res.data?.data;
  } catch (error) {
    console.error(`Failed to fetch reservation ${id}:`, error);
    throw error;
  }
}
