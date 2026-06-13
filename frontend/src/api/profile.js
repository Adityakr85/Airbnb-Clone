import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

/**
 * Get user profile from backend
 */
export async function getProfile(clerkId) {
  const res = await axios.get(`${API_BASE}/api/user/profile`, {
    params: { clerk_id: clerkId },
  });
  return res.data?.data ?? null;
}

/**
 * Update user profile in backend
 */
export async function updateProfile(clerkId, profileData) {
  const res = await axios.put(`${API_BASE}/api/user/profile`, {
    clerk_id: clerkId,
    ...profileData,
  });
  return res.data?.data ?? null;
}

/**
 * Upload profile photo to backend
 */
export async function uploadProfilePhoto(clerkId, photoFile) {
  const formData = new FormData();
  formData.append("clerk_id", clerkId);
  formData.append("photo", photoFile);

  const res = await axios.post(`${API_BASE}/api/user/profile/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data?.data ?? null;
}

/**
 * Delete profile photo from backend
 */
export async function deleteProfilePhoto(clerkId) {
  const res = await axios.delete(`${API_BASE}/api/user/profile/photo`, {
    data: { clerk_id: clerkId },
  });
  return res.data;
}