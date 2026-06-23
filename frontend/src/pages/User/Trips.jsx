import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { fetchGuestTrips } from "../../api/trips";

const Trips = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      if (!isLoaded || !user?.id) {
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

  if (!isLoaded || loading) {
    return <div className="p-10 text-center font-semibold">Loading your trips...</div>;
  }

  const upcoming = trips.filter(
    (t) => t.status === "upcoming" || t.status === "pending" || t.status === "confirmed"
  );

  const past = trips.filter(
    (t) => t.status === "completed" || t.status === "cancelled"
  );

  const nights = (checkIn, checkOut) =>
    Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="mb-10 text-4xl font-bold">My Trips</h1>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Upcoming Trips</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming trips booked yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((trip) => (
              <TripCard key={trip.id} trip={trip} navigate={navigate} nights={nights} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Past Trips</h2>
        {past.length === 0 ? (
          <p className="text-gray-500">No past trips recorded.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {past.map((trip) => (
              <TripCard key={trip.id} trip={trip} navigate={navigate} nights={nights} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

function TripCard({ trip, navigate, nights }) {
  const n = nights(trip.check_in, trip.check_out);
  const total = trip.total || (trip.property?.price * n || 0);

  const statusStyle =
    trip.status === "confirmed"
      ? "bg-green-100 text-green-700"
      : trip.status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : trip.status === "completed"
      ? "bg-blue-100 text-blue-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={trip.property?.images?.[0] || "/placeholder.jpg"}
        alt={trip.property?.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-bold">{trip.property?.title || "Property Listing"}</h3>
        <p className="mt-1 text-gray-500">📍 {trip.property?.location || "Unknown location"}</p>
        <p className="mt-3 text-gray-700">Check-in: {trip.check_in}</p>
        <p className="text-gray-700">Check-out: {trip.check_out}</p>
        <p className="text-gray-700">Guests: {trip.guests} · {n} nights</p>
        <p className="mt-2 font-semibold">₹{Number(total).toLocaleString("en-IN")}</p>
        <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusStyle}`}>
          {trip.status}
        </span>
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