import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function fetchAdminUsers(clerkId) {
  try {
    const res = await axios.get(`${API_BASE}/api/admin/users`, {
      params: { clerk_id: clerkId }
    });
    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    throw error;
  }
}

export async function fetchAdminProperties(clerkId) {
  try {
    const res = await axios.get(`${API_BASE}/api/admin/properties`, {
      params: { clerk_id: clerkId }
    });
    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch admin properties:", error);
    throw error;
  }
}

export async function fetchAdminReservations(clerkId) {
  try {
    const res = await axios.get(`${API_BASE}/api/admin/reservations`, {
      params: { clerk_id: clerkId }
    });
    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch admin reservations:", error);
    throw error;
  }
}

export async function fetchAdminAnalytics(clerkId) {
  try {
    const res = await axios.get(`${API_BASE}/api/admin/analytics`, {
      params: { clerk_id: clerkId }
    });
    return res.data?.data || {};
  } catch (error) {
    console.error("Failed to fetch admin analytics:", error);
    throw error;
  }
}