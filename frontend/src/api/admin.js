import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function fetchAdminUsers(clerkId, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;
    const res = await axios.get(`${API_BASE}/api/admin/users`, {
      params,
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
      params,
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
      params,
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
      params,
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
    const res = await axios.post(
      `${API_BASE}/api/admin/properties/${propertyId}/approve`,
      null,
      { params },
    );
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
    const res = await axios.post(
      `${API_BASE}/api/admin/properties/${propertyId}/reject`,
      null,
      { params },
    );
    return res.data;
  } catch (error) {
    console.error("Failed to reject property:", error);
    throw error;
  }
}

export async function fetchAdminNotifications(clerkId, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;
    const res = await axios.get(`${API_BASE}/api/admin/notifications`, {
      params,
    });
    return res.data?.data?.data || res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch admin notifications:", error);
    throw error;
  }
}

export async function sendAdminNotification(clerkId, payload, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;
    const res = await axios.post(
      `${API_BASE}/api/admin/notifications/send`,
      payload,
      { params },
    );
    return res.data;
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    throw error;
  }
}

export async function fetchAdminCategories(clerkId, role = null, filters = {}) {
  try {
    const params = { clerk_id: clerkId };

    if (role) params.role = role;
    if (filters.category_for && filters.category_for !== "all") {
      params.category_for = filters.category_for;
    }
    if (filters.search) {
      params.search = filters.search;
    }

    const res = await axios.get(`${API_BASE}/api/admin/categories`, {
      params,
    });

    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch admin categories:", error);
    throw error;
  }
}

export async function createAdminCategory(clerkId, payload, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;

    const res = await axios.post(`${API_BASE}/api/admin/categories`, payload, {
      params,
    });

    return res.data?.data;
  } catch (error) {
    console.error("Failed to create admin category:", error);
    throw error;
  }
}

export async function updateAdminCategory(
  clerkId,
  categoryId,
  payload,
  role = null,
) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;

    const res = await axios.put(
      `${API_BASE}/api/admin/categories/${categoryId}`,
      payload,
      { params },
    );

    return res.data?.data;
  } catch (error) {
    console.error("Failed to update admin category:", error);
    throw error;
  }
}

export async function deleteAdminCategory(clerkId, categoryId, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;

    const res = await axios.delete(
      `${API_BASE}/api/admin/categories/${categoryId}`,
      { params },
    );

    return res.data;
  } catch (error) {
    console.error("Failed to delete admin category:", error);
    throw error;
  }
}

export async function toggleAdminCategory(clerkId, categoryId, role = null) {
  try {
    const params = { clerk_id: clerkId };
    if (role) params.role = role;

    const res = await axios.patch(
      `${API_BASE}/api/admin/categories/${categoryId}/toggle`,
      null,
      { params },
    );

    return res.data?.data;
  } catch (error) {
    console.error("Failed to toggle admin category:", error);
    throw error;
  }
}
