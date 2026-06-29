import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

/**
 * Universal Normalizer for Help Center items (both Top Articles & Guides)
 */
function normalizeHelpItem(item) {
  const rawImage = item.image || "/placeholder.jpg";
  const fullImageUrl = rawImage.startsWith("http")
    ? rawImage
    : `${API_BASE}/storage/${rawImage.replace(/^\//, "")}`;

  return {
    ...item,
    id: item.id,
    title: item.title || item.page_title || "Untitled Article",
    summary: item.summary || "Click to view the full help documentation...",
    image: fullImageUrl,
    images: [fullImageUrl],
    type: "article",    
    url: `/help/article/${item.id}`,
  };
}

export async function fetchTopArticles(params = {}) {
  try {
    const response = await axios.get(`${API_BASE}/api/help-center/top-articles`, { params });
    const rawData = response.data?.data || response.data || [];
    return rawData.map(normalizeHelpItem);

  } catch (error) {
    console.error("Error fetching top articles:", error);
    throw new Error(error.response?.data?.message || "Failed to load top articles from server.");
  }
}

export async function fetchGuides(params = {}) {
  try {
    const response = await axios.get(`${API_BASE}/api/help-center/guides`, { params });
    const rawData = response.data?.data || response.data || [];
    return rawData.map(normalizeHelpItem);

  } catch (error) {
    console.error("Error fetching guides:", error);
    throw new Error(error.response?.data?.message || "Failed to load category guides.");
  }
}

export async function fetchExploreMore() {
  try {
    const response = await axios.get(`${API_BASE}/api/help-center/explore`);
    const rawData = response.data?.data || response.data || [];
    return rawData.map(normalizeHelpItem);
  } catch (error) {
    console.error("Error fetching explore items:", error);
    return []; 
  }
}
export async function fetchArticleById(id) {
  try {
    const res = await axios.get(`${API_BASE}/api/help-center/article/${id}`);
    const data = res.data?.data || res.data;
    return data ? normalizeHelpItem(data) : null;

  } catch (error) {
    console.error(`Failed to fetch article ${id}:`, error);
    throw new Error(error.response?.data?.message || "article not found.");
  }
}
export async function fetchAllTopics(tab) {
  try {
    const response = await axios.get(`${API_BASE}/api/help-center/all-topics`, { 
      params: { tab } 
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error(`Error fetching all topics for ${tab}:`, error);
    throw new Error(error.response?.data?.message || "Failed to load topics directory.");
  }
}
export async function fetchTopicCategory(id) {
  try {
    const response = await axios.get(`${API_BASE}/api/help-center/topic/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error(`Error fetching topic ${id}:`, error);
    throw new Error(error.response?.data?.message || "Failed to load topic details.");
  }
}