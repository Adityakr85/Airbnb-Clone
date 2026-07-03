import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { fetchReservationDetails, cancelReservation } from "../../api/trips";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function getPropertyImage(property) {
  if (!property) return "/placeholder.jpg";

  let image =
    property.image || property.image_urls?.[0] || property.images?.[0] || "";

  if (typeof image === "object") {
    image = image.url || image.image_path || "";
  }

  if (!image || typeof image !== "string") return "/placeholder.jpg";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/storage/")) {
    return `${API_BASE}${image}`;
  }

  if (image.startsWith("storage/")) {
    return `${API_BASE}/${image}`;
  }

  return `${API_BASE}/storage/${image}`;
}

function getPropertyCategory(property) {
  return property?.category?.name || property?.category_name || "Property";
}

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      if (!isLoaded) return;

      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchReservationDetails(id, user.id);
        setTrip(data);
      } catch (err) {
        console.error("Error loading booking details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [id, isLoaded, user?.id]);

  const getStatus = (trip) =>
    trip?.realtime_status || trip?.status || "pending";

  const getStatusStyle = (status) => {
    if (status === "completed") return "bg-blue-100 text-blue-700";
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      setCancelLoading(true);
      const updatedReservation = await cancelReservation(trip.id, user.id);

      setTrip((prev) => ({
        ...prev,
        ...updatedReservation,
        status: "cancelled",
        realtime_status: "cancelled",
      }));
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="p-10 text-center font-semibold">
        Loading booking details...
      </div>
    );
  }

  if (!trip || !trip.property) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-bold">Booking Not Found</h1>
      </div>
    );
  }

  const property = trip.property;
  const status = getStatus(trip);
  const statusStyle = getStatusStyle(status);
  const canCancel = status === "pending";

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(trip.check_out) - new Date(trip.check_in)) /
        (1000 * 60 * 60 * 24),
    ),
  );

  const totalPrice = trip.total || property.price * nights;
  const propertyImage = getPropertyImage(property);
  const propertyCategory = getPropertyCategory(property);

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <h1 className="mb-8 text-4xl font-bold">Booking Details</h1>

      <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-md">
        <div className="relative">
          <img
            src={propertyImage}
            alt={property.title || "Property"}
            onClick={() => navigate(`/property/${property.id}`)}
            className="h-[550px] w-full cursor-pointer rounded-t-2xl object-cover object-center transition duration-300 hover:scale-[1.02]"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />

          <span
            className={`absolute right-5 top-5 rounded-full px-4 py-2 text-sm font-bold capitalize shadow-md ${statusStyle}`}
          >
            {status}
          </span>
        </div>

        <div className="p-6">
          <h2
            onClick={() => navigate(`/property/${property.id}`)}
            className="cursor-pointer text-3xl font-bold transition hover:text-[#FF385C]"
          >
            {property.title}
          </h2>

          <p className="mt-2 text-gray-600">📍 {property.location}</p>
          <p className="mt-2">⭐ {property.rating || "New"}</p>
          <p className="mt-2 text-gray-700">{propertyCategory}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Reservation Details</h2>
          <p>
            <strong>Booking ID:</strong> BK-
            {trip.id.toString().padStart(5, "0")}
          </p>
          <p className="mt-2">
            <strong>Status:</strong>{" "}
            <span className="font-semibold capitalize">{status}</span>
          </p>
          <p className="mt-2">
            <strong>Guests:</strong> {trip.guests}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Check-in & Check-out</h2>
          <p>
            <strong>Check-in:</strong> {trip.check_in}
          </p>
          <p className="mt-2">
            <strong>Check-out:</strong> {trip.check_out}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Property Information</h2>
          <p>
            <strong>Property Category:</strong> {propertyCategory}
          </p>
          <p className="mt-2">
            <strong>Bedrooms:</strong> {property.bedrooms || "N/A"}
          </p>
          <p className="mt-2">
            <strong>Bathrooms:</strong> {property.bathrooms || "N/A"}
          </p>
          <p className="mt-2">
            <strong>Guests Limit:</strong> {property.guests || "N/A"}
          </p>
          <p className="mt-2">
            <strong>Price Per Night:</strong> ₹
            {Number(property.price).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Payment Summary</h2>

        <p>
          <strong>Total Nights:</strong> {nights}
        </p>

        <p className="mt-2">
          <strong>Total Price:</strong> ₹
          {Number(totalPrice).toLocaleString("en-IN")}
        </p>

        {canCancel && (
          <button
            onClick={handleCancelBooking}
            disabled={cancelLoading}
            className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLoading ? "Cancelling..." : "Cancel Booking"}
          </button>
        )}
      </div>
    </div>
  );
}
