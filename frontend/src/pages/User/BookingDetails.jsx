import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchReservationDetails } from "../../api/trips";
import { useUser } from "@clerk/clerk-react";

const BookingDetails = () => {
  const { id } = useParams();
  const { user } = useUser();
  const clerkId = user?.id;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetails() {
      try {
        // If we don't have a clerkId, we still try to fetch without it (though the backend will require it)
        const data = await fetchReservationDetails(id, clerkId);
        setTrip(data);
      } catch (err) {
        console.error("Error loading booking details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [id, clerkId]);

  if (loading) {
    return <div className="p-10 text-center font-semibold">Loading booking details...</div>;
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-bold">
          Booking Not Found
        </h1>
      </div>
    );
  }

  const property = trip.property;

  if (!property) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-bold">
          Property Information Missing
        </h1>
      </div>
    );
  }

  const nights = Math.ceil(
    (new Date(trip.check_out) - new Date(trip.check_in)) /
      (1000 * 60 * 60 * 24)
  );

  const totalPrice = trip.total || property.price * nights;

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Booking Details
      </h1>

      <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-md">
          <img
            src={property.images?.[0] || "/placeholder.jpg"}
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
              ⭐ {property.rating || "New"}
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
            <span className="capitalize font-semibold">{trip.status}</span>
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
            <strong>Check-in:</strong> {trip.check_in}
          </p>

          <p className="mt-2">
            <strong>Check-out:</strong> {trip.check_out}
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
            <strong>Guests Limit:</strong>{" "}
            {property.guests || "N/A"}
          </p>

          <p className="mt-2">
            <strong>Price Per Night:</strong> ₹
            {Number(property.price).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;