import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function normalizeAdminData(res) {
  return res.data?.data || [];
}

export async function fetchAdminUsers(clerkId) {
  const res = await axios.get(`${API_BASE}/api/admin/users`, {
    params: { clerk_id: clerkId },
  });

  return normalizeAdminData(res);
}

export async function fetchCurrentAdminUser(clerkId) {
  const res = await axios.get(`${API_BASE}/api/admin/current-user`, {
    params: { clerk_id: clerkId },
  });

  return res.data?.data;
}

export async function updateAdminUserRole(clerkId, userId, role) {
  const res = await axios.patch(`${API_BASE}/api/admin/users/${userId}/role`, {
    clerk_id: clerkId,
    role,
  });

  return res.data;
}

export async function updateAdminUserStatus(clerkId, userId, status) {
  const res = await axios.patch(
    `${API_BASE}/api/admin/users/${userId}/status`,
    {
      clerk_id: clerkId,
      status,
    },
  );

  return res.data;
}

export async function deleteAdminUser(clerkId, userId) {
  const res = await axios.delete(`${API_BASE}/api/admin/users/${userId}`, {
    data: {
      clerk_id: clerkId,
    },
  });

  return res.data;
}

export async function fetchAdminProperties(clerkId) {
  try {
    const res = await axios.get(`${API_BASE}/api/admin/properties`, {
      params: {
        clerk_id: clerkId,
      },
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
      params: {
        clerk_id: clerkId,
      },
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
      params: {
        clerk_id: clerkId,
      },
    });

    return res.data?.data || {};
  } catch (error) {
    console.error("Failed to fetch admin analytics:", error);
    throw error;
  }
}

export async function approveProperty(clerkId, propertyId) {
  try {
    const res = await axios.post(
      `${API_BASE}/api/admin/properties/${propertyId}/approve`,
      null,
      {
        params: {
          clerk_id: clerkId,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error("Failed to approve property:", error);
    throw error;
  }
}

export async function rejectProperty(clerkId, propertyId) {
  try {
    const res = await axios.post(
      `${API_BASE}/api/admin/properties/${propertyId}/reject`,
      null,
      {
        params: {
          clerk_id: clerkId,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error("Failed to reject property:", error);
    throw error;
  }
}

export async function fetchAdminNotifications(clerkId) {
  try {
    const res = await axios.get(`${API_BASE}/api/admin/notifications`, {
      params: {
        clerk_id: clerkId,
      },
    });

    return res.data?.data?.data || res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch admin notifications:", error);
    throw error;
  }
}

export async function sendAdminNotification(clerkId, payload) {
  try {
    const res = await axios.post(
      `${API_BASE}/api/admin/notifications/send`,
      payload,
      {
        params: {
          clerk_id: clerkId,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    throw error;
  }
}

export async function fetchAdminCategories(clerkId, filters = {}) {
  try {
    const params = {
      clerk_id: clerkId,
    };

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

export async function createAdminCategory(clerkId, payload) {
  try {
    const res = await axios.post(`${API_BASE}/api/admin/categories`, payload, {
      params: {
        clerk_id: clerkId,
      },
    });

    return res.data?.data;
  } catch (error) {
    console.error("Failed to create admin category:", error);
    throw error;
  }
}

export async function updateAdminCategory(clerkId, categoryId, payload) {
  try {
    const res = await axios.put(
      `${API_BASE}/api/admin/categories/${categoryId}`,
      payload,
      {
        params: {
          clerk_id: clerkId,
        },
      },
    );

    return res.data?.data;
  } catch (error) {
    console.error("Failed to update admin category:", error);
    throw error;
  }
}

export async function deleteAdminCategory(clerkId, categoryId) {
  try {
    const res = await axios.delete(
      `${API_BASE}/api/admin/categories/${categoryId}`,
      {
        params: {
          clerk_id: clerkId,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error("Failed to delete admin category:", error);
    throw error;
  }
}

export async function toggleAdminCategory(clerkId, categoryId) {
  try {
    const res = await axios.patch(
      `${API_BASE}/api/admin/categories/${categoryId}/toggle`,
      null,
      {
        params: {
          clerk_id: clerkId,
        },
      },
    );

    return res.data?.data;
  } catch (error) {
    console.error("Failed to toggle admin category:", error);
    throw error;
  }
}
