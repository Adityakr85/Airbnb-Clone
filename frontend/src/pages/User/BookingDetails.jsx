import React from "react";
import { useParams } from "react-router-dom";
import properties from "../../data/properties";
import trips from "../../data/trips";

const BookingDetails = () => {
  const { id } = useParams();

  const trip = trips.find(
    (trip) => trip.id === Number(id)
  );

  if (!trip) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-bold">
          Booking Not Found
        </h1>
      </div>
    );
  }

  const property = properties.find(
    (property) => property.id === trip.propertyId
  );

  if (!property) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-bold">
          Property Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Booking Details
      </h1>

      <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-md">
        <img
          src={property.image}
          alt={property.title}
          className="h-[400px] w-full object-cover"
        />

        <div className="p-6">
          <h2 className="text-3xl font-bold">
            {property.title}
          </h2>

          <p className="mt-2 text-gray-600">
            📍 {property.location}
          </p>

          <p className="mt-2">
            ⭐ {property.rating}
          </p>

          <p className="mt-2 text-gray-700">
            {property.type || "Property"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">
            Reservation Details
          </h2>

          <p>
            <strong>Booking ID:</strong> BK-
            {trip.id.toString().padStart(5, "0")}
          </p>

          <p className="mt-2">
            <strong>Status:</strong>{" "}
            {trip.status === "upcoming"
              ? "Confirmed"
              : "Completed"}
          </p>

          <p className="mt-2">
            <strong>Guests:</strong> {trip.guests}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">
            Check-in & Check-out
          </h2>

          <p>
            <strong>Check-in:</strong> {trip.checkIn}
          </p>

          <p className="mt-2">
            <strong>Check-out:</strong> {trip.checkOut}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">
            Property Information
          </h2>

          <p>
            <strong>Property Type:</strong>{" "}
            {property.type || "Property"}
          </p>

          <p className="mt-2">
            <strong>Bedrooms:</strong>{" "}
            {property.bedrooms || "N/A"}
          </p>

          <p className="mt-2">
            <strong>Bathrooms:</strong>{" "}
            {property.bathrooms || "N/A"}
          </p>

          <p className="mt-2">
            <strong>Guests:</strong>{" "}
            {property.guests || "N/A"}
          </p>

          <p className="mt-2">
            <strong>Price Per Night:</strong> ₹
            {property.price.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;