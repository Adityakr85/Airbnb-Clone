import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
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
  Filter,
} from "lucide-react";
import { useHost } from "../../pages/Host/HostContext";
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
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            to="/host"
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-xl font-bold text-gray-900">Reservations</h1>

            <p className="text-sm text-gray-500">
              {reservations.length} total bookings
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {Object.entries(counts).map(([key, count]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition ${filter === key ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-600"}`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {count > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20" : "bg-gray-200"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
            <Calendar size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">
              No {filter !== "all" ? filter : ""} reservations
            </p>
          </div>
        )}

        {filtered.map((r) => {
          const StatusIcon = STATUS_CONFIG[r.status]?.icon || Clock;
          const n = nights(r.checkIn, r.checkOut);
          const isExpanded = expandedId === r.id;

          return (
            <div
              key={r.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-5">
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {r.guest.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">
                          {r.guest.name}
                        </p>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${STATUS_CONFIG[r.status]?.color}`}
                        >
                          <StatusIcon size={11} />
                          {STATUS_CONFIG[r.status]?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{r.propertyTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      ₹{r.total.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-400">{n} nights</p>
                  </div>
                </div>

                {/* Info Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Check-in</p>
                      <p className="font-medium">{r.checkIn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Check-out</p>
                      <p className="font-medium">{r.checkOut}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={14} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Guests</p>
                      <p className="font-medium">{r.guests} guests</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IndianRupee size={14} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Per night</p>
                      <p className="font-medium">
                        ₹{(r.total / n).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guest message */}
                {r.message && (
                  <div className="mt-3 flex items-start gap-2 bg-gray-50 rounded-xl px-4 py-3">
                    <MessageSquare
                      size={14}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-sm text-gray-600 italic">
                      "{r.message}"
                    </p>
                  </div>
                )}

                {/* Expanded guest details */}
                {isExpanded && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User size={14} /> Guest Contact Details
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} className="text-gray-400" />
                      <a
                        href={`mailto:${r.guest.email}`}
                        className="hover:text-rose-500 transition"
                      >
                        {r.guest.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} className="text-gray-400" />
                      <a
                        href={`tel:${r.guest.phone}`}
                        className="hover:text-rose-500 transition"
                      >
                        {r.guest.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-gray-400 text-xs">Booking ID:</span>
                      <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-gray-200">
                        {r.id}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : r.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-200 rounded-full hover:bg-gray-50 transition"
                  >
                    <User size={13} />
                    {isExpanded ? "Hide" : "Guest Details"}
                  </button>

                  {r.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAccept(r.id)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                      >
                        <CheckCircle size={13} /> Accept
                      </button>
                      <button
                        onClick={() => handleDecline(r.id)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      >
                        <XCircle size={13} /> Decline
                      </button>
                    </>
                  )}

                  {r.status === "confirmed" && (
                    <button
                      onClick={() => handleDecline(r.id)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition"
                    >
                      <XCircle size={13} /> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
