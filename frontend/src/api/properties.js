import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function parseImageUrls(value) {
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [value.trim()];
  }
}

function normalizeProperty(property) {
  const imageUrls = parseImageUrls(property.image_urls);
  const image = property.image || imageUrls[0] || "";

  return {
    ...property,
    image,
    image_urls: imageUrls,
    price: property.price ?? property.price_per_night ?? property.base_price,
  };
}

export async function fetchProperties({ search } = {}) {
  const params = {};
  if (search && search.trim()) params.search = search.trim();

  const res = await axios.get(`${API_BASE}/api/properties`, { params });
  return (res.data?.data ?? []).map(normalizeProperty);
}

export async function createProperty(payload) {
  const res = await axios.post(`${API_BASE}/api/properties`, payload);
  return res.data?.data ? normalizeProperty(res.data.data) : undefined;
}

