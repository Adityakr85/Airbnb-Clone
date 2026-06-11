import React from "react";
import { useNavigate } from "react-router-dom";
import properties from "../../data/properties";

const styles = `
  .trips-page {
    max-width: 1200px;
    margin: auto;
    padding: 32px;
    font-family: Arial, sans-serif;
  }

  .page-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 30px;
  }

  .section-title {
    font-size: 24px;
    margin-bottom: 20px;
    margin-top: 30px;
  }

  .trip-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
  }

  .trip-card {
    background: white;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
  }

  .trip-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 24px rgba(0,0,0,0.12);
  }

  .trip-image {
    width: 100%;
    height: 220px;
    object-fit: cover;
  }

  .trip-content {
    padding: 18px;
  }

  .trip-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .trip-location {
    color: #717171;
    margin-bottom: 12px;
  }

  .trip-info {
    margin-bottom: 8px;
    color: #444;
  }

  .status {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    margin-top: 8px;
  }

  .confirmed {
    background: #d4f8d4;
    color: #1b5e20;
  }

  .completed {
    background: #f1f1f1;
    color: #444;
  }

  .details-btn {
    width: 100%;
    margin-top: 16px;
    border: none;
    background: #ff385c;
    color: white;
    padding: 12px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 15px;
    transition: 0.3s;
  }

  .details-btn:hover {
    background: #e31c5f;
  }
`;

const upcomingTrips = [
  {
    ...properties[0],
    checkIn: "15 Jun 2026",
    checkOut: "20 Jun 2026",
    status: "Confirmed",
  },
  {
    ...properties[3],
    checkIn: "10 Jul 2026",
    checkOut: "15 Jul 2026",
    status: "Confirmed",
  },
];

const pastTrips = [
  {
    ...properties[2],
    checkIn: "10 Mar 2026",
    checkOut: "15 Mar 2026",
    status: "Completed",
  },
  {
    ...properties[4],
    checkIn: "05 Feb 2026",
    checkOut: "09 Feb 2026",
    status: "Completed",
  },
];

const Trips = () => {
  const navigate = useNavigate();

  const TripCard = ({ trip }) => (
    <div className="trip-card">
      <img
        src={trip.image}
        alt={trip.title}
        className="trip-image"
      />

      <div className="trip-content">
        <div className="trip-title">
          {trip.title}
        </div>

        <div className="trip-location">
          📍 {trip.location}
        </div>

        <div className="trip-info">
          Check-in: {trip.checkIn}
        </div>

        <div className="trip-info">
          Check-out: {trip.checkOut}
        </div>

        <div className="trip-info">
          Guests: {trip.guests || "N/A"}
        </div>

        <div className="trip-info">
          Total Cost: ₹
          {(trip.price * 5).toLocaleString("en-IN")}
        </div>

        <span
          className={`status ${
            trip.status === "Confirmed"
              ? "confirmed"
              : "completed"
          }`}
        >
          {trip.status}
        </span>

        <button
          className="details-btn"
          onClick={() =>
            navigate(
              `/pages/User/BookingDetails/${trip.id}`
            )
          }
        >
          View Booking Details
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>

      <div className="trips-page">
        <h1 className="page-title">
          My Trips
        </h1>

        <h2 className="section-title">
          Upcoming Trips
        </h2>

        <div className="trip-grid">
          {upcomingTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
            />
          ))}
        </div>

        <h2 className="section-title">
          Past Trips
        </h2>

        <div className="trip-grid">
          {pastTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Trips;