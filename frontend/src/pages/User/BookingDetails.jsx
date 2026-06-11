import React from "react";
import { useParams } from "react-router-dom";
import properties from "../../data/properties";

const BookingDetails = () => {
  const { id } = useParams();

  const property =
    properties.find(
      (p) => p.id === Number(id)
    ) || properties[0];

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>
        Booking Details
      </h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "25px",
          background: "#fff",
        }}
      >
        <img
          src={property.image}
          alt={property.title}
          style={{
            width: "100%",
            height: "350px",
            objectFit: "cover",
          }}
        />

        <div style={{ padding: "20px" }}>
          <h2>{property.title}</h2>

          <p>📍 {property.location}</p>

          <p>⭐ {property.rating}</p>

          <p>{property.type}</p>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>Reservation Details</h2>

        <p>
          <strong>Booking ID:</strong> BK-
          {property.id.toString().padStart(5, "0")}
        </p>

        <p>
          <strong>Status:</strong> Confirmed
        </p>

        <p>
          <strong>Guests:</strong>{" "}
          {property.guests || "N/A"}
        </p>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>Check-in & Check-out</h2>

        <p>
          <strong>Check-in:</strong> 15 Jun 2026
        </p>

        <p>
          <strong>Check-out:</strong> 20 Jun 2026
        </p>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2>Property Information</h2>

        <p>
          <strong>Property Type:</strong>{" "}
          {property.type || "Property"}
        </p>

        <p>
          <strong>Bedrooms:</strong>{" "}
          {property.bedrooms || "N/A"}
        </p>

        <p>
          <strong>Bathrooms:</strong>{" "}
          {property.bathrooms || "N/A"}
        </p>

        <p>
          <strong>Guests:</strong>{" "}
          {property.guests || "N/A"}
        </p>

        <p>
          <strong>Price Per Night:</strong>{" "}
          ₹
          {property.price.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
};

export default BookingDetails;