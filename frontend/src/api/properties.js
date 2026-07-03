import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function parseImageUrls(value) {
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [value.trim()];
  } catch {
    return [value.trim()];
  }
}

function normalizeProperty(property) {
  const parsedImages = [
    ...parseImageUrls(property.image),
    ...parseImageUrls(property.image_urls),
    ...parseImageUrls(property.images),
  ];

  const uniqueImages = [...new Set(parsedImages)];

  const finalImages =
    uniqueImages.length > 0 ? uniqueImages : ["/placeholder.jpg"];

  return {
    ...property,
    image: finalImages[0],
    images: finalImages,
    image_urls: finalImages,
    price:
      property.price ?? property.price_per_night ?? property.base_price ?? 0,
  };
}

export async function fetchProperties(params = {}) {
  try {
    const response = await axios.get(`${API_BASE}/api/properties`, { params });
    const rawData = response.data?.data || response.data || [];
    return rawData.map(normalizeProperty);
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error(
      error.response?.data?.message || "Failed to load properties from server.",
    );
  }
}

export async function fetchPropertyById(id) {
  try {
    const res = await axios.get(`${API_BASE}/api/properties/${id}`);
    const data = res.data?.data || res.data;
    return data ? normalizeProperty(data) : null;
  } catch (error) {
    console.error(`Failed to fetch property ${id}:`, error);
    throw new Error("Property not found.");
  }
}

export async function createProperty(payload) {
  try {
    const res = await axios.post(`${API_BASE}/api/properties`, payload);
    const data = res.data?.data || res.data;
    return data ? normalizeProperty(data) : undefined;
  } catch (error) {
    console.error("Failed to create property:", error);
    throw new Error(
      error.response?.data?.message || "Failed to save to database.",
    );
  }
}
