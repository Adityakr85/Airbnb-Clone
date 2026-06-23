import { Link } from "react-router-dom";
import {
  Home,
  CalendarCheck,
  ArrowRight,
  Star,
  Eye,
  IndianRupee,
  Clock,
} from "lucide-react";
import { useHost } from "./HostContext";

export default function HostDashboard() {
  const { properties, reservations, totalRevenue, totalBookings, loading } =
    useHost();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white">
        <p className="text-gray-500">Loading host dashboard...</p>
      </div>
    );
  }

  const pendingReservations = reservations.filter(
    (r) => r.status === "pending",
  );

  const confirmedReservations = reservations.filter(
    (r) => r.status === "confirmed",
  );

  const stats = [
    {
      label: "Total Properties",
      value: properties.length,
      icon: Home,
      color: "bg-rose-50 text-rose-500",
      link: "/host/properties",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: CalendarCheck,
      color: "bg-blue-50 text-blue-500",
      link: "/host/reservations",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green-50 text-green-500",
      link: "/host/analytics",
    },
    {
      label: "Pending Requests",
      value: pendingReservations.length,
      icon: Clock,
      color: "bg-amber-50 text-amber-500",
      link: "/host/reservations",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="mt-1 text-gray-500">
            Welcome back! Here's what's happening with your listings.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color, link }) => (
            <Link
              key={label}
              to={link}
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
              >
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="mt-1 text-sm text-gray-500">{label}</p>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Your Properties</h2>

              <Link
                to="/host/properties"
                className="flex items-center gap-1 text-sm font-medium text-rose-500 transition-all hover:gap-2"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-gray-50">
              {properties.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400">
                  <Home size={32} className="mx-auto mb-2 opacity-30" />
                  <p>No properties listed yet</p>
                </div>
              ) : (
                properties.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 px-6 py-4 transition hover:bg-gray-50"
                  >
                    <img
                      src={p.image ? `${p.image}?w=80&q=70` : ""}
                      alt={p.title}
                      className="h-14 w-14 flex-shrink-0 rounded-xl object-cover bg-gray-100"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {p.title}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {p.location}
                      </p>

                      <div className="mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Star
                            size={12}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {p.rating || "New"}
                        </span>

                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Eye size={12} />
                          {p.views || 0} views
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{Number(p.price || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-500">per night</p>

                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                          p.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.status || "active"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">
                Pending Requests
                {pendingReservations.length > 0 && (
                  <span className="ml-2 rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
                    {pendingReservations.length}
                  </span>
                )}
              </h2>

              <Link
                to="/host/reservations"
                className="flex items-center gap-1 text-sm font-medium text-rose-500 transition-all hover:gap-2"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {pendingReservations.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400">
                <CalendarCheck size={32} className="mx-auto mb-2 opacity-30" />
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pendingReservations.map((r) => (
                  <div
                    key={r.id}
                    className="px-6 py-4 transition hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
                            {r.guest?.avatar ? (
                              <img
                                src={r.guest.avatar}
                                alt=""
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              r.guest?.name?.charAt(0)?.toUpperCase() || "G"
                            )}
                          </div>

                          <p className="font-medium text-gray-900">
                            {r.guest?.name || "Guest"}
                          </p>
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {r.propertyTitle}
                        </p>

                        <p className="text-xs text-gray-400">
                          {r.checkIn} → {r.checkOut} · {r.guests} guests
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{Number(r.total || 0).toLocaleString("en-IN")}
                        </p>

                        <Link
                          to="/host/reservations"
                          className="mt-1 block text-xs text-rose-500 hover:underline"
                        >
                          Review →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {confirmedReservations.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Upcoming Stays</h2>

              <Link
                to="/host/reservations"
                className="flex items-center gap-1 text-sm font-medium text-rose-500 transition-all hover:gap-2"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid divide-y divide-gray-100 md:grid-cols-2 md:divide-x md:divide-y-0">
              {confirmedReservations.map((r) => (
                <div key={r.id} className="px-6 py-4">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {r.guest?.avatar ? (
                        <img
                          src={r.guest.avatar}
                          alt=""
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        r.guest?.name?.charAt(0)?.toUpperCase() || "G"
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {r.guest?.name || "Guest"}
                      </p>
                      <p className="text-xs text-gray-500">{r.propertyTitle}</p>
                    </div>

                    <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                      Confirmed
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      📅 {r.checkIn} → {r.checkOut}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{Number(r.total || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
