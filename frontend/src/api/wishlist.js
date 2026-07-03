import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function fetchWishlist(clerkId) {
  const res = await axios.get(`${API_BASE}/api/wishlist`, {
    params: { clerk_id: clerkId },
  });

  return res.data?.data || [];
}

export async function toggleWishlist(clerkId, propertyId) {
  const res = await axios.post(`${API_BASE}/api/wishlist/toggle`, {
    clerk_id: clerkId,
    property_id: propertyId,
  });

  return res.data;
}

export async function checkWishlist(clerkId, propertyId) {
  const res = await axios.get(`${API_BASE}/api/wishlist/check`, {
    params: { clerk_id: clerkId, property_id: propertyId },
  });

  return res.data?.wishlisted || false;
}
