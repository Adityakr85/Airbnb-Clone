import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function fetchAdminUsers(clerkId, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;
    const res = await axios.get(`${API_BASE}/api/admin/users`, {
      params
    });
    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    throw error;
  }
}

export async function fetchAdminProperties(clerkId, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;
    const res = await axios.get(`${API_BASE}/api/admin/properties`, {
      params
    });
    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch admin properties:", error);
    throw error;
  }
}

export async function fetchAdminReservations(clerkId, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;
    const res = await axios.get(`${API_BASE}/api/admin/reservations`, {
      params
    });
    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch admin reservations:", error);
    throw error;
  }
}

export async function fetchAdminAnalytics(clerkId, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;
    const res = await axios.get(`${API_BASE}/api/admin/analytics`, {
      params
    });
    return res.data?.data || {};
  } catch (error) {
    console.error("Failed to fetch admin analytics:", error);
    throw error;
  }
}

export async function approveProperty(clerkId, propertyId, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;
    const res = await axios.post(`${API_BASE}/api/admin/properties/${propertyId}/approve`, null, { params });
    return res.data;
  } catch (error) {
    console.error("Failed to approve property:", error);
    throw error;
  }
}

export async function rejectProperty(clerkId, propertyId, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;
    const res = await axios.post(`${API_BASE}/api/admin/properties/${propertyId}/reject`, null, { params });
    return res.data;
  } catch (error) {
    console.error("Failed to reject property:", error);
    throw error;
  }
}