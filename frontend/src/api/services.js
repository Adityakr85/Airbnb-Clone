import axios from "axios";

// Using localhost for maximum speed!
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

function normalizeService(service) {
  // Extract images safely using the parser
  const parsedImages = parseImageUrls(service.images || service.image_urls);
  
  // Create a safe fallback if the database has absolutely no images
  const fallbackImage = service.image || parsedImages[0] || "/placeholder.jpg";
  const finalImages = parsedImages.length > 0 ? parsedImages : [fallbackImage];

  return {
    ...service,
    image: fallbackImage,
    images: finalImages, // This guarantees 'images' is ALWAYS a clean array!
    price: service.price ?? service.base_price ?? 0,
  };
}

export async function fetchServices({ search, type } = {}) {
  try {
    const params = {};
    if (search && search.trim()) params.search = search.trim();
    if (type && type.trim()) params.type = type.trim();

    const res = await axios.get(`${API_BASE}/api/services`, { params });
    
    // Map through the results and normalize every single row before giving it to React
    const rawData = res.data?.data || res.data || [];
    return rawData.map(normalizeService);
    
  } catch (error) {
    console.error("Database fetch failed:", error);
    throw new Error(error.response?.data?.message || "Failed to load services from server.");
  }
}

export async function fetchServiceById(id) {
  try {
    const res = await axios.get(`${API_BASE}/api/services/${id}`);
    const data = res.data?.data || res.data;
    return data ? normalizeService(data) : null;
  } catch (error) {
    console.error(`Failed to fetch service ${id}:`, error);
    throw new Error("Service not found.");
  }
}

export async function createService(payload) {
  try {
    const res = await axios.post(`${API_BASE}/api/services`, payload);
    const data = res.data?.data || res.data;
    return data ? normalizeService(data) : undefined;
  } catch (error) {
    console.error("Failed to create service:", error);
    throw new Error(error.response?.data?.message || "Failed to save to database.");
  }
}