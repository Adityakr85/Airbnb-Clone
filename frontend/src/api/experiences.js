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

function normalizeExperience(experience) {
  // Extract images safely using the parser
  const parsedImages = parseImageUrls(experience.images || experience.image_urls);
  
  // Create a safe fallback if the database has absolutely no images
  const fallbackImage = experience.image || parsedImages[0] || "/placeholder.jpg";
  const finalImages = parsedImages.length > 0 ? parsedImages : [fallbackImage];

  return {
    ...experience,
    image: fallbackImage,
    images: finalImages, // This guarantees 'images' is ALWAYS a clean array!
    price: experience.price ?? experience.base_price ?? 0,
  };
}

export async function fetchExperiences({ search } = {}) {
  try {
    const params = {};
    if (search && search.trim()) params.search = search.trim();

    const res = await axios.get(`${API_BASE}/api/experiences`, { params });
    
    // Map through the results and normalize every single row before giving it to React
    const rawData = res.data?.data || res.data || [];
    return rawData.map(normalizeExperience);
    
  } catch (error) {
    console.error("Database fetch failed:", error);
    throw new Error(error.response?.data?.message || "Failed to load experiences from server.");
  }
}

export async function fetchExperienceById(id) {
  try {
    const res = await axios.get(`${API_BASE}/api/experiences/${id}`);
    const data = res.data?.data || res.data;
    return data ? normalizeExperience(data) : null;
  } catch (error) {
    console.error(`Failed to fetch experience ${id}:`, error);
    throw new Error("Experience not found.");
  }
}

export async function createExperience(payload) {
  try {
    const res = await axios.post(`${API_BASE}/api/experiences`, payload);
    const data = res.data?.data || res.data;
    return data ? normalizeExperience(data) : undefined;
  } catch (error) {
    console.error("Failed to create experience:", error);
    throw new Error(error.response?.data?.message || "Failed to save to database.");
  }
}