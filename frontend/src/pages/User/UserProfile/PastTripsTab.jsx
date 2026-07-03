import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { fetchGuestTrips } from "../../../api/trips";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function getImageUrl(value) {
  if (!value) return "/placeholder.jpg";

  if (typeof value === "object") {
    value = value.url || value.image_path || "";
  }

  if (typeof value !== "string" || !value.trim()) return "/placeholder.jpg";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/storage/")) {
    return `${API_BASE}${value}`;
  }

  if (value.startsWith("storage/")) {
    return `${API_BASE}/${value}`;
  }

  return `${API_BASE}/storage/${value}`;
}

function getPropertyImage(property) {
  if (!property) return "/placeholder.jpg";

  return getImageUrl(
    property.image || property.image_urls?.[0] || property.images?.[0],
  );
}

export default function PastTripsTab() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPastTrips() {
      if (!isLoaded) return;

      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchGuestTrips(user.id);
        setPastTrips(
          data.filter(
            (trip) => (trip.realtime_status || trip.status) === "completed",
          ),
        );
      } catch (err) {
        console.error("Failed to load past trips:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPastTrips();
  }, [user?.id, isLoaded]);

  const nights = (checkIn, checkOut) =>
    Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));

  if (!isLoaded || loading) {
    return (
      <div className="p-10 text-center font-semibold">
        Loading past trips...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold">Past Trips</h2>

      {pastTrips.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center">
          <div className="text-9xl">🧳</div>
          <p className="mt-6 max-w-sm text-center text-gray-900">
            No past trips yet.
          </p>
          <Link
            to="/"
            className="mt-8 rounded-xl bg-[#e31c5f] px-7 py-4 font-semibold text-white hover:bg-[#ff385c]"
          >
            Explore Homes
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {pastTrips.map((trip) => {
            const property = trip.property;
            const n = nights(trip.check_in, trip.check_out);
            const total = trip.total || property?.price * n || 0;

            return (
              <div
                key={trip.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-lg"
              >
                <img
                  src={getPropertyImage(property)}
                  alt={property?.title || "Property"}
                  onClick={() => navigate(`/property/${property?.id}`)}
                  className="h-52 w-full cursor-pointer object-cover transition hover:opacity-90"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />

                <div className="p-5">
                  <h3
                    onClick={() => navigate(`/property/${property?.id}`)}
                    className="cursor-pointer text-lg font-semibold transition hover:text-[#FF385C]"
                  >
                    {property?.title || "Property Listing"}
                  </h3>

                  <p className="mt-1 text-gray-500">
                    📍 {property?.location || "Unknown location"}
                  </p>

                  <p className="mt-2 text-gray-700">
                    Check-in: {trip.check_in}
                  </p>
                  <p className="text-gray-700">Check-out: {trip.check_out}</p>

                  <p className="mt-2 text-gray-700">
                    Guests: {trip.guests} · {n} nights
                  </p>

                  <p className="mt-2 font-semibold">
                    ₹{Number(total).toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/pages/User/BookingDetails/${trip.id}`)
                    }
                    className="mt-4 w-full rounded-lg bg-[#FF385C] py-3 font-medium text-white hover:bg-[#E31C5F]"
                  >
                    View Booking Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
