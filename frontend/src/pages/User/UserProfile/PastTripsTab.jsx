import { Link } from "react-router-dom";

export default function PastTripsTab() {
  const pastTrips = JSON.parse(localStorage.getItem("pastTrips")) || [];

  return (
    <div>
      <h2 className="text-3xl font-semibold">Past trips</h2>

      {pastTrips.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center">
          <div className="text-9xl">🧳</div>

          <p className="mt-6 max-w-sm text-center text-gray-900">
            You’ll find your past reservations here after you’ve taken your
            first trip on Airbnb.
          </p>

          <Link
            to="/"
            className="mt-8 rounded-xl bg-[#e31c5f] px-7 py-4 font-semibold text-white hover:bg-[#ff385c]"
          >
            Book a trip
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid max-w-4xl grid-cols-2 gap-6">
          {pastTrips.map((trip) => (
            <Link
              key={trip.id}
              to={`/property/${trip.propertyId}`}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-lg"
            >
              <img
                src={trip.image}
                alt={trip.title}
                className="h-52 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold">{trip.location}</h3>

                <p className="mt-1 text-gray-500">
                  {trip.checkIn} - {trip.checkOut}
                </p>

                <p className="mt-2 font-semibold">
                  ₹{Number(trip.total).toLocaleString("en-IN")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
