import { createContext, useContext, useState } from "react";
import { initialProperties, initialReservations } from "../../data/hostdata";

const HostContext = createContext(null);

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

