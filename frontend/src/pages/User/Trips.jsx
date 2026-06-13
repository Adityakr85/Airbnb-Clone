import React from "react";
import { useNavigate } from "react-router-dom";
import properties from "../../data/properties";
import trips from "../../data/trips";

const Trips = () => {
  const navigate = useNavigate();

  const upcomingTrips = trips
    .filter((trip) => trip.status === "upcoming")
    .map((trip) => ({
      ...trip,
      property: properties.find(
        (property) => property.id === trip.propertyId
      ),
    }))
    .filter((trip) => trip.property);

  const pastTrips = trips
    .filter((trip) => trip.status === "completed")
    .map((trip) => ({
      ...trip,
      property: properties.find(
        (property) => property.id === trip.propertyId
      ),
    }))
    .filter((trip) => trip.property);

  const TripCard = ({ trip }) => {
    const nights = Math.ceil(
      (new Date(trip.checkOut) - new Date(trip.checkIn)) /
        (1000 * 60 * 60 * 24)
    );

    const totalPrice = trip.property.price * nights;

    return (
      <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <img
          src={trip.property.image}
          alt={trip.property.title}
          className="h-56 w-full object-cover"
        />

        <div className="p-5">
          <h3 className="text-xl font-bold">
            {trip.property.title}
          </h3>

          <p className="mt-1 text-gray-500">
            📍 {trip.property.location}
          </p>

          <p className="mt-3 text-gray-700">
            Check-in: {trip.checkIn}
          </p>

          <p className="text-gray-700">
            Check-out: {trip.checkOut}
          </p>

          <p className="text-gray-700">
            Guests: {trip.guests}
          </p>

          <p className="mt-2 font-semibold">
            ₹{totalPrice.toLocaleString("en-IN")}
          </p>

          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
              trip.status === "upcoming"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {trip.status === "upcoming"
              ? "Confirmed"
              : "Completed"}
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {upcomingTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>

      <h2 className="mb-6 mt-12 text-2xl font-semibold">
        Past Trips
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {pastTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
};

export default Trips;