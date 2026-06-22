import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const HostContext = createContext(null);

export function HostProvider({ children }) {
  const { user, isLoaded } = useUser();
  const [properties, setProperties] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHostData() {
      if (!isLoaded || !user?.id) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/host/dashboard`, {
          params: { clerk_id: user.id },
        });
        if (res.data?.success) {
          setProperties(res.data.data.properties || []);
          setReservations(res.data.data.reservations || []);
        }
      } catch (err) {
        console.error("Failed to fetch host dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHostData();

    // Fetch destinations
    async function fetchDestinations() {
      try {
        const res = await axios.get(`${API_BASE}/api/properties/destinations`);
        if (res.data?.success) {
          setDestinations(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      }
    }
    fetchDestinations();
  }, [user?.id, isLoaded]);

  const addProperty = async (propertyData) => {
    if (!user?.id) return;
    try {
      const formData = new FormData();
      // Append regular fields
      Object.keys(propertyData).forEach(key => {
        if (propertyData[key] !== undefined && propertyData[key] !== null) {
          if (key === 'images') {
            // Handle file array
            if (propertyData.images && propertyData.images.length) {
              propertyData.images.forEach((file, index) => {
                formData.append('images[]', file);
              });
            }
          } else {
            formData.append(key, propertyData[key]);
          }
        }
      });
      formData.append('clerk_id', user.id);

      const res = await axios.post(`${API_BASE}/api/properties`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data?.success) {
        const newProp = res.data.data;
        setProperties((prev) => [newProp, ...prev]);
        return newProp;
      }
    } catch (err) {
      console.error("Failed to add property:", err);
      throw err;
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      const formData = new FormData();
      // Append regular fields
      Object.keys(propertyData).forEach(key => {
        if (propertyData[key] !== undefined && propertyData[key] !== null) {
          if (key === 'images') {
            // Handle file array
            if (propertyData.images && propertyData.images.length) {
              propertyData.images.forEach((file, index) => {
                formData.append('images[]', file);
              });
            }
          } else {
            formData.append(key, propertyData[key]);
          }
        }
      });
      // Note: For update, we might need to include _method=PUT if axios.put doesn't work with FormData? 
      // But axios.put with FormData should set correct headers.
      const res = await axios.put(`${API_BASE}/api/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data?.success) {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...propertyData } : p))
        );
      }
    } catch (err) {
      console.error("Failed to update property:", err);
    }
  };

  const deleteProperty = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/api/properties/${id}`);
      if (res.data?.success) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete property:", err);
    }
  };

  const updateReservation = async (id, updates) => {
    try {
      const res = await axios.patch(`${API_BASE}/api/reservations/${id}/status`, updates);
      if (res.data?.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
        );
      }
    } catch (err) {
      console.error("Failed to update reservation status:", err);
    }
  };

  const totalRevenue = properties.reduce((sum, p) => sum + Number(p.earnings || 0), 0);
  const totalBookings = properties.reduce((sum, p) => sum + Number(p.bookings || 0), 0);

  return (
    <HostContext.Provider
      value={{
        properties,
        reservations,
        destinations,
        addProperty,
        updateProperty,
        deleteProperty,
        updateReservation,
        totalRevenue,
        totalBookings,
        loading,
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

