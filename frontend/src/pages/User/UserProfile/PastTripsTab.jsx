import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { fetchGuestTrips } from "../../../api/trips";

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

        const completedTrips = data.filter(
          (trip) => (trip.realtime_status || trip.status) === "completed",
        );

        setPastTrips(completedTrips);
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
                  src={
                    property?.images?.[0] ||
                    property?.image ||
                    "/placeholder.jpg"
                  }
                  alt={property?.title || "Property"}
                  onClick={() => navigate(`/property/${property?.id}`)}
                  className="h-52 w-full cursor-pointer object-cover transition hover:opacity-90"
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
