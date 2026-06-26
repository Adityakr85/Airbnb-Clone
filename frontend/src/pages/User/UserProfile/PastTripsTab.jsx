import { Link } from "react-router-dom";
import trips from "../../../data/trips";
import properties from "../../../data/properties";
export default function PastTripsTab() {
  const currentUserId = "demo-user";

  const pastTrips = trips
    .filter(
      (trip) => trip.userId === currentUserId && trip.status === "completed",
    )
    .map((trip) => ({
      ...trip,
      property: properties.find((property) => property.id === trip.propertyId),
    }))
    .filter((trip) => trip.property);

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
          {pastTrips.map((trip) => (
            <Link
              key={trip.id}
              to={`/pages/User/BookingDetails/${trip.id}`}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-lg"
            >
              <img
                src={trip.property.image}
                alt={trip.property.title}
                className="h-52 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold">{trip.property.title}</h3>

                <p className="mt-1 text-gray-500">
                  📍 {trip.property.location}
                </p>

                <p className="mt-2 text-gray-700">
                  {trip.checkIn} - {trip.checkOut}
                </p>

                <p className="mt-2 text-gray-700">Guests: {trip.guests}</p>

                <span className="mt-3 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
                  Completed
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
