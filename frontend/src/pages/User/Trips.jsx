import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { fetchGuestTrips } from "../../api/trips";

const Trips = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [tripsList, setTripsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      if (!isLoaded || !user?.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchGuestTrips(user.id);
        setTripsList(data);
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

  const upcomingTrips = tripsList.filter(
    (trip) => trip.status === "upcoming" || trip.status === "pending" || trip.status === "confirmed"
  );

  const pastTrips = tripsList.filter(
    (trip) => trip.status === "completed" || trip.status === "cancelled"
  );

  const TripCard = ({ trip }) => {
    const nights = Math.ceil(
      (new Date(trip.check_out) - new Date(trip.check_in)) /
        (1000 * 60 * 60 * 24)
    );

    const totalPrice = trip.total || (trip.property ? trip.property.price * nights : 0);

    return (
      <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
         <img
           src={trip.property?.images?.[0] || "/placeholder.jpg"}
           alt={trip.property?.title}
           className="h-56 w-full object-cover"
         />

        <div className="p-5">
          <h3 className="text-xl font-bold">
            {trip.property?.title || "Property Listing"}
          </h3>

          <p className="mt-1 text-gray-500">
            📍 {trip.property?.location || "Unknown location"}
          </p>

          <p className="mt-3 text-gray-700">
            Check-in: {trip.check_in}
          </p>

          <p className="text-gray-700">
            Check-out: {trip.check_out}
          </p>

          <p className="text-gray-700">
            Guests: {trip.guests}
          </p>

          <p className="mt-2 font-semibold">
            ₹{Number(totalPrice).toLocaleString("en-IN")}
          </p>

          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize ${
              trip.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : trip.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : trip.status === "completed"
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {trip.status}
          </span>

          <button
            onClick={() =>
              navigate(
                `/pages/User/BookingDetails/${trip.id}`
              )
            }
            className="mt-4 w-full rounded-lg bg-[#FF385C] py-3 font-medium text-white hover:bg-[#E31C5F]"
          >
            View Booking Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="mb-10 text-4xl font-bold">
        My Trips
      </h1>

      <h2 className="mb-6 text-2xl font-semibold">
        Upcoming Trips
      </h2>

      {upcomingTrips.length === 0 ? (
        <p className="text-gray-500 mb-8">No upcoming trips booked yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {upcomingTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}

      <h2 className="mb-6 mt-12 text-2xl font-semibold">
        Past Trips
      </h2>

      {pastTrips.length === 0 ? (
        <p className="text-gray-500">No past trips recorded.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pastTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trips;