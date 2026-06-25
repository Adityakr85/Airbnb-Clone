import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  IndianRupee,
  MessageSquare,
} from "lucide-react";
import { useHost } from "./HostContext";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-600",
    icon: XCircle,
  },
};

export default function HostReservations() {
  const { reservations, updateReservation } = useHost();
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtered =
    filter === "all"
      ? reservations
      : reservations.filter((r) => r.status === filter);

  const counts = {
    all: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    completed: reservations.filter((r) => r.status === "completed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

  const totalValue = reservations.reduce(
    (sum, r) => sum + Number(r.total || 0),
    0,
  );

  const handleAccept = (id) => {
    updateReservation(id, { status: "confirmed" });
    toast.success("Booking confirmed! Guest has been notified.");
  };

  const handleDecline = (id) => {
    updateReservation(id, { status: "cancelled" });
    toast.error("Booking declined.");
  };

  const nights = (checkIn, checkOut) => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-rose-500">
                Host bookings
              </p>
              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                Reservations
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Review booking requests, manage guest details and track stay
                status.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SummaryCard label="Total" value={counts.all} />
              <SummaryCard label="Pending" value={counts.pending} />
              <SummaryCard
                label="Revenue"
                value={`₹${totalValue.toLocaleString("en-IN")}`}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
          {Object.entries(counts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === key
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              {count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    filter === key ? "bg-white/20" : "bg-gray-200"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-16 text-center shadow-sm">
            <Calendar size={42} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-lg font-bold text-gray-900">
              No {filter !== "all" ? filter : ""} reservations
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              New bookings and requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => {
              const StatusIcon = STATUS_CONFIG[r.status]?.icon || Clock;
              const n = nights(r.checkIn, r.checkOut);
              const isExpanded = expandedId === r.id;

              return (
                <div
                  key={r.id}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-100 text-sm font-bold text-rose-600">
                          {r.guest?.avatar ? (
                            <img
                              src={r.guest.avatar}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            r.guest?.name?.charAt(0)?.toUpperCase() || "G"
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-bold text-gray-900">
                              {r.guest?.name || "Guest"}
                            </h2>

                            <span
                              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                STATUS_CONFIG[r.status]?.color
                              }`}
                            >
                              <StatusIcon size={12} />
                              {STATUS_CONFIG[r.status]?.label || r.status}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-gray-500">
                            {r.propertyTitle}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Booking ID: {r.id}
                          </p>
                        </div>
                      </div>

                      <div className="text-left lg:text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{Number(r.total || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-gray-400">{n} nights</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 rounded-2xl bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
                      <InfoItem
                        icon={Calendar}
                        label="Check-in"
                        value={r.checkIn}
                      />
                      <InfoItem
                        icon={Calendar}
                        label="Check-out"
                        value={r.checkOut}
                      />
                      <InfoItem
                        icon={Users}
                        label="Guests"
                        value={`${r.guests} guests`}
                      />
                      <InfoItem
                        icon={IndianRupee}
                        label="Per night"
                        value={`₹${Math.round(
                          Number(r.total || 0) / n,
                        ).toLocaleString("en-IN")}`}
                      />
                    </div>

                    {r.message && (
                      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-rose-50 px-4 py-3">
                        <MessageSquare
                          size={16}
                          className="mt-0.5 flex-shrink-0 text-rose-500"
                        />
                        <p className="text-sm italic text-gray-700">
                          "{r.message}"
                        </p>
                      </div>
                    )}

                    {isExpanded && (
                      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
                        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
                          <User size={15} />
                          Guest contact details
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <ContactItem
                            icon={Mail}
                            href={`mailto:${r.guest?.email || ""}`}
                            value={r.guest?.email || "No email provided"}
                          />
                          <ContactItem
                            icon={Phone}
                            href={`tel:${r.guest?.phone || ""}`}
                            value={r.guest?.phone || "No phone provided"}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : r.id)}
                        className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        <User size={14} />
                        {isExpanded ? "Hide details" : "Guest details"}
                      </button>

                      {r.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAccept(r.id)}
                            className="flex items-center gap-1.5 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                          >
                            <CheckCircle size={14} />
                            Accept
                          </button>

                          <button
                            onClick={() => handleDecline(r.id)}
                            className="flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                          >
                            <XCircle size={14} />
                            Decline
                          </button>
                        </>
                      )}

                      {r.status === "confirmed" && (
                        <button
                          onClick={() => handleDecline(r.id)}
                          className="flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          <XCircle size={14} />
                          Cancel booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-right">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500">
        <Icon size={15} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, href, value }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
    >
      <Icon size={15} className="text-gray-400" />
      <span className="truncate">{value}</span>
    </a>
  );
}
