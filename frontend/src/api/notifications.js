import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function fetchNotifications(clerkId) {
  try {
    const res = await axios.get(`${API_BASE}/api/notifications`, {
      params: { clerk_id: clerkId }
    });
    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }
}

export async function fetchUnreadNotificationCount(clerkId) {
  try {
    const res = await axios.get(`${API_BASE}/api/notifications/unread-count`, {
      params: { clerk_id: clerkId }
    });
    return res.data?.count || 0;
  } catch (error) {
    console.error("Failed to fetch unread count:", error);
    return 0;
  }
}

export async function markNotificationAsRead(clerkId, notificationId) {
  try {
    const res = await axios.post(`${API_BASE}/api/notifications/${notificationId}/read`, {
      clerk_id: clerkId
    });
    return res.data;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(clerkId) {
  try {
    const res = await axios.post(`${API_BASE}/api/notifications/read-all`, {
      clerk_id: clerkId
    });
    return res.data;
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    throw error;
  }
}

export async function deleteNotification(clerkId, notificationId) {
  try {
    const res = await axios.delete(`${API_BASE}/api/notifications/${notificationId}`, {
      params: { clerk_id: clerkId }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to delete notification:", error);
    throw error;
  }
}