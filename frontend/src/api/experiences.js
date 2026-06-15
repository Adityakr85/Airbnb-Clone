import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5173/";

const mockExperiences = [
  {
    id: 1,
    title: "Cooking Class with a Local Chef",
    description:
      "Learn to cook authentic Indian cuisine from a professional chef in a home kitchen.",
    location: "Mumbai, India",
    category: "culinary",
    price: 65,
    duration: "3 hours",
    groupSize: "Up to 8",
    rating: 4.9,
    reviews: 324,
    hostName: "Priya Kumar",
    hostImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    level: "Beginner friendly",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop",
    ],
  },
  {
    id: 2,
    title: "Street Art Walking Tour",
    description:
      "Explore vibrant street art and learn about the city's cultural history from an artist.",
    location: "Bangalore, India",
    category: "culture",
    price: 35,
    duration: "2.5 hours",
    groupSize: "Up to 12",
    rating: 4.8,
    reviews: 289,
    hostName: "Arun Singh",
    hostImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    level: "All levels",
    images: [
      "https://images.unsplash.com/photo-1508246418170-09ff9f30b309?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1470306844957-79ecc63b9b56?w=500&h=400&fit=crop",
    ],
  },
  {
    id: 3,
    title: "Yoga & Meditation Retreat",
    description:
      "Start your day with sunrise yoga and meditation in a peaceful garden setting.",
    location: "Goa, India",
    category: "wellness",
    price: 45,
    duration: "1.5 hours",
    groupSize: "Up to 15",
    rating: 4.95,
    reviews: 512,
    hostName: "Ananya Sharma",
    hostImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    level: "All levels",
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1493391857671-20bdf4f802c2?w=500&h=400&fit=crop",
    ],
  },
  {
    id: 4,
    title: "Mountain Hiking Adventure",
    description:
      "Trek through scenic mountain trails with breathtaking views and wildlife spotting.",
    location: "Himachal Pradesh, India",
    category: "adventure",
    price: 55,
    duration: "4 hours",
    groupSize: "Up to 10",
    rating: 4.9,
    reviews: 198,
    hostName: "Raj Patel",
    hostImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    level: "Moderate",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=400&fit=crop",
    ],
  },
  {
    id: 5,
    title: "Photography Walk in Old City",
    description:
      "Capture stunning photographs with tips from a professional photographer.",
    location: "Delhi, India",
    category: "workshops",
    price: 50,
    duration: "3 hours",
    groupSize: "Up to 6",
    rating: 4.85,
    reviews: 156,
    hostName: "Maya Reddy",
    hostImage:
      "https://images.unsplash.com/photo-1517046220202-51b0b2af5fcf?w=100&h=100&fit=crop",
    level: "Beginner friendly",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&h=400&fit=crop",
    ],
  },
  {
    id: 6,
    title: "Sunset Backwater Cruise",
    description:
      "Experience the serene backwaters with traditional houseboat tour and local snacks.",
    location: "Kerala, India",
    category: "nature",
    price: 75,
    duration: "2 hours",
    groupSize: "Up to 20",
    rating: 4.92,
    reviews: 423,
    hostName: "Karthik Nair",
    hostImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    level: "All levels",
    images: [
      "https://images.unsplash.com/photo-1503891077046-353193ce6808?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500&h=400&fit=crop",
    ],
  },
  {
    id: 7,
    title: "Pottery & Ceramic Workshop",
    description:
      "Learn the art of pottery making on the wheel with a master craftsman.",
    location: "Jaipur, India",
    category: "workshops",
    price: 48,
    duration: "2.5 hours",
    groupSize: "Up to 8",
    rating: 4.87,
    reviews: 134,
    hostName: "Rajesh Verma",
    hostImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    level: "Beginner friendly",
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1578270996834-58e6fb10c4f0?w=500&h=400&fit=crop",
    ],
  },
  {
    id: 8,
    title: "Spice Market Tour & Tasting",
    description:
      "Explore vibrant spice markets and learn about Indian spices with tasting session.",
    location: "Chennai, India",
    category: "culinary",
    price: 40,
    duration: "2 hours",
    groupSize: "Up to 10",
    rating: 4.91,
    reviews: 287,
    hostName: "Lakshmi Iyer",
    hostImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    level: "All levels",
    images: [
      "https://images.unsplash.com/photo-1596040294343-1e1e7c9cec84?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1599599810694-b5ac4dd4c8d5?w=500&h=400&fit=crop",
    ],
  },
];

export async function fetchExperiences({ search } = {}) {
  try {
    const res = await axios.get(`${API_BASE}/api/experiences`, {
      params: search ? { search } : {},
    });
    return res.data?.data ?? mockExperiences;
  } catch (error) {
    console.log("Using mock experiences data");
    return mockExperiences;
  }
}

export async function fetchExperienceById(id) {
  try {
    const res = await axios.get(`${API_BASE}/api/experiences/${id}`);
    return res.data?.data;
  } catch (error) {
    return mockExperiences.find((exp) => exp.id === parseInt(id));
  }
}

export async function createExperience(payload) {
  const res = await axios.post(`${API_BASE}/api/experiences`, payload);
  return res.data?.data;
}
