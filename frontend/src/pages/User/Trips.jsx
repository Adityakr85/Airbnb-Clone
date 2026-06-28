import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { fetchGuestTrips } from "../../api/trips";

const Trips = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    async function loadTrips() {
      if (!isLoaded) return;

      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchGuestTrips(user.id);
        setTrips(data);
      } catch (err) {
        console.error("Failed to load trips:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, [user?.id, isLoaded]);

  const getStatus = (trip) => trip.realtime_status || trip.status || "pending";

  const getStatusStyle = (status) => {
    if (status === "completed") return "bg-blue-100 text-blue-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const nights = (checkIn, checkOut) =>
    Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));

  const filteredTrips =
    activeFilter === "all"
      ? trips
      : trips.filter((trip) => getStatus(trip) === activeFilter);

  if (!isLoaded || loading) {
    return (
      <div className="p-10 text-center font-semibold">
        Loading your trips...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="mb-8 text-4xl font-bold">My Trips</h1>

      <div className="mb-8 flex flex-wrap gap-3">
        {["all", "pending", "completed", "cancelled"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
              activeFilter === filter
                ? "bg-[#FF385C] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredTrips.length === 0 ? (
        <p className="text-gray-500">No trips found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              navigate={navigate}
              nights={nights}
              getStatus={getStatus}
              getStatusStyle={getStatusStyle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function TripCard({ trip, navigate, nights, getStatus, getStatusStyle }) {
  const status = getStatus(trip);
  const statusStyle = getStatusStyle(status);

  const n = nights(trip.check_in, trip.check_out);
  const total = trip.total || trip.property?.price * n || 0;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <img
          src={trip.property?.images?.[0] || "/placeholder.jpg"}
          alt={trip.property?.title || "Property"}
          onClick={() => navigate(`/property/${trip.property?.id}`)}
          className="h-56 w-full cursor-pointer object-cover transition hover:opacity-90"
        />

        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-semibold capitalize shadow-md ${statusStyle}`}
        >
          {status}
        </span>
      </div>

      <div className="p-5">
        <h3
          onClick={() => navigate(`/property/${trip.property?.id}`)}
          className="cursor-pointer text-xl font-bold transition hover:text-[#FF385C]"
        >
          {trip.property?.title || "Property Listing"}
        </h3>

        <p className="mt-1 text-gray-500">
          📍 {trip.property?.location || "Unknown location"}
        </p>

        <p className="mt-3 text-gray-700">Check-in: {trip.check_in}</p>
        <p className="text-gray-700">Check-out: {trip.check_out}</p>

        <p className="text-gray-700">
          Guests: {trip.guests} · {n} nights
        </p>

        <p className="mt-2 font-semibold">
          ₹{Number(total).toLocaleString("en-IN")}
        </p>

        <button
          onClick={() => navigate(`/pages/User/BookingDetails/${trip.id}`)}
          className="mt-4 w-full rounded-lg bg-[#FF385C] py-3 font-medium text-white hover:bg-[#E31C5F]"
        >
          View Booking Details
        </button>
      </div>
    </div>
  );
}

export default Trips;
