import { createContext, useContext, useState } from "react";

const HostContext = createContext(null);

const initialProperties = [
  {
    id: 101,
    title: "Luxury Beach Villa",
    location: "Goa, India",
    price: 4500,
    rating: 4.9,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    type: "Villa",
    status: "active",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    views: 342,
    bookings: 18,
    earnings: 81000,
    description:
      "A stunning beachfront villa with panoramic ocean views, private pool, and lush tropical gardens.",
  },
  {
    id: 102,
    title: "Mountain View Cabin",
    location: "Manali, India",
    price: 2800,
    rating: 4.8,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    type: "Cabin",
    status: "active",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
    views: 215,
    bookings: 11,
    earnings: 30800,
    description:
      "Cozy wooden cabin nestled in the mountains with breathtaking views and a fireplace.",
  },
  {
    id: 103,
    title: "Modern City Apartment",
    location: "Mumbai, India",
    price: 3200,
    rating: 4.7,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    type: "Apartment",
    status: "inactive",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    views: 178,
    bookings: 9,
    earnings: 28800,
    description:
      "Sleek, modern apartment in the heart of Mumbai with city skyline views.",
  },
];

const initialReservations = [
  {
    id: "R001",
    propertyId: 101,
    propertyTitle: "Luxury Beach Villa",
    guest: { name: "Priya Sharma", avatar: "PS", email: "priya@example.com", phone: "+91 98765 43210" },
    checkIn: "2026-06-15",
    checkOut: "2026-06-20",
    guests: 4,
    total: 22500,
    status: "confirmed",
    message: "Looking forward to our stay!",
  },
  {
    id: "R002",
    propertyId: 102,
    propertyTitle: "Mountain View Cabin",
    guest: { name: "Arjun Mehta", avatar: "AM", email: "arjun@example.com", phone: "+91 91234 56789" },
    checkIn: "2026-06-18",
    checkOut: "2026-06-21",
    guests: 2,
    total: 8400,
    status: "pending",
    message: "We are a couple celebrating our anniversary.",
  },
  {
    id: "R003",
    propertyId: 101,
    propertyTitle: "Luxury Beach Villa",
    guest: { name: "Sneha Patil", avatar: "SP", email: "sneha@example.com", phone: "+91 87654 32109" },
    checkIn: "2026-07-01",
    checkOut: "2026-07-07",
    guests: 6,
    total: 27000,
    status: "pending",
    message: "Family vacation with kids. Any special amenities for children?",
  },
  {
    id: "R004",
    propertyId: 103,
    propertyTitle: "Modern City Apartment",
    guest: { name: "Rahul Verma", avatar: "RV", email: "rahul@example.com", phone: "+91 76543 21098" },
    checkIn: "2026-05-10",
    checkOut: "2026-05-14",
    guests: 2,
    total: 12800,
    status: "completed",
    message: "Business trip.",
  },
];

export function HostProvider({ children }) {
  const [properties, setProperties] = useState(initialProperties);
  const [reservations, setReservations] = useState(initialReservations);

  const addProperty = (property) => {
    const newProp = {
      ...property,
      id: Date.now(),
      status: "active",
      views: 0,
      bookings: 0,
      earnings: 0,
    };
    setProperties((prev) => [newProp, ...prev]);
    return newProp;
  };

  const updateProperty = (id, updates) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProperty = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const updateReservation = (id, updates) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const totalRevenue = properties.reduce((sum, p) => sum + p.earnings, 0);
  const totalBookings = properties.reduce((sum, p) => sum + p.bookings, 0);

  return (
    <HostContext.Provider
      value={{
        properties,
        reservations,
        addProperty,
        updateProperty,
        deleteProperty,
        updateReservation,
        totalRevenue,
        totalBookings,
      }}
    >
      {children}
    </HostContext.Provider>
  );
}

export function useHost() {
  const ctx = useContext(HostContext);
  if (!ctx) throw new Error("useHost must be used within HostProvider");
  return ctx;
}
