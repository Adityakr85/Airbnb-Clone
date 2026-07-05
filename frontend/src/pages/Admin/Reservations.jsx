import { useMemo, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Search,
  Download,
  CalendarCheck,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
  MoreVertical,
  X,
  Trash2,
  RotateCcw,
  Mail,
} from "lucide-react";
import { fetchAdminReservations } from "../../api/admin";

export default function Reservations() {
  const { user, isLoaded } = useUser();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reservations from API
  const fetchReservations = async () => {
    try {
      if (!isLoaded) return;

      const clerkId = user?.id;
      if (!clerkId) {
        setReservations([]);
        setError("Unable to load reservations: User not authenticated");
        return;
      }

      const data = await fetchAdminReservations(clerkId);
      setReservations(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load reservations:", err);
      setError("Failed to load reservations. Please try again later.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchReservations();

    // Set up polling for real-time updates (every 5 seconds)
    const intervalId = setInterval(fetchReservations, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.guest.toLowerCase().includes(search.toLowerCase()) ||
        item.property.toLowerCase().includes(search.toLowerCase()) ||
        item.host.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, status]);

  const stats = useMemo(() => {
    return {
      total: reservations.length,
      confirmed: reservations.filter((r) => r.status === "Confirmed").length,
      pending: reservations.filter((r) => r.status === "Pending").length,
      cancelled: reservations.filter((r) => r.status === "Cancelled").length,
    };
  }, [reservations]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        Loading reservations...
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-600">{error}</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Reservations</h1>
          <p className="mt-1 text-gray-500">
            Manage bookings, guests, hosts, payments, cancellations, and
            refunds.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export Reservations
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.total}
          icon={CalendarCheck}
          active={status === "All"}
          onClick={() => setStatus("All")}
        />

        <StatCard
          title="Confirmed"
          value={stats.confirmed}
          icon={CheckCircle}
          active={status === "Confirmed"}
          onClick={() => setStatus("Confirmed")}
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          active={status === "Pending"}
          onClick={() => setStatus("Pending")}
        />

        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          active={status === "Cancelled"}
          onClick={() => setStatus("Cancelled")}
        />
      </div>

      <div className="rounded-[1.7rem] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by reservation ID, guest, host, or property..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.7rem] border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-bold">Reservation</th>
                <th className="px-6 py-4 font-bold">Guest</th>
                <th className="px-6 py-4 font-bold">Host</th>
                <th className="px-6 py-4 font-bold">Property</th>
                <th className="px-6 py-4 font-bold">Dates</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Payment</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredReservations.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedReservation(item)}
                  className="cursor-pointer transition hover:bg-gray-50"
                >
                  <td className="px-6 py-5 font-black text-gray-950">
                    {item.id}
                  </td>

                  <td className="px-6 py-5">
                    <p className="font-bold text-gray-950">{item.guest}</p>
                    <p className="text-xs text-gray-500">{item.guestEmail}</p>
                  </td>

                  <td className="px-6 py-5 text-gray-600">{item.host}</td>

                  <td className="px-6 py-5 font-semibold text-gray-800">
                    {item.property}
                  </td>

                  <td className="px-6 py-5">
                    <p className="font-semibold">{item.checkIn}</p>
                    <p className="text-xs text-gray-500">
                      to {item.checkOut} · {item.nights} nights
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1 font-black">
                      <IndianRupee size={15} />
                      {item.amount.replace("₹", "")}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <PaymentBadge status={item.payment} />
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReservation(item);
                      }}
                      className="rounded-full p-2 transition hover:bg-gray-100"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReservation && (
        <ReservationDrawer
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  );
}

function ReservationDrawer({ reservation, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Reservation Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-rose-500 to-orange-400 p-6 text-white">
          <p className="text-sm font-semibold text-white/80">Reservation ID</p>
          <h3 className="mt-1 text-3xl font-black">{reservation.id}</h3>
          <p className="mt-2 text-white/90">{reservation.property}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <StatusBadge status={reservation.status} />
          <PaymentBadge status={reservation.payment} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="Guest" value={reservation.guest} />
          <Info title="Host" value={reservation.host} />
          <Info title="Check-in" value={reservation.checkIn} />
          <Info title="Check-out" value={reservation.checkOut} />
          <Info title="Nights" value={reservation.nights} />
          <Info title="Amount" value={reservation.amount} />
          <Info title="Created" value={reservation.created} />
          <Info title="Email" value={reservation.guestEmail} />
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800">
            <Mail size={18} />
            Contact Guest
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-50 px-5 py-3 font-bold text-yellow-700 hover:bg-yellow-100">
            <RotateCcw size={18} />
            Process Refund
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-bold text-red-600 hover:bg-red-100">
            <XCircle size={18} />
            Cancel Reservation
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Delete Record
          </button>
        </div>
      </aside>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase text-gray-400">{title}</p>
      <p className="mt-1 font-bold text-gray-950">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "Confirmed"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Pending"
        ? "bg-yellow-50 text-yellow-600"
        : "bg-red-50 text-red-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const style =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Pending"
        ? "bg-yellow-50 text-yellow-600"
        : status === "Refunded"
          ? "bg-blue-50 text-blue-600"
          : status === "Failed"
            ? "bg-red-50 text-red-600"
            : "bg-gray-50 text-gray-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {status}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[1.7rem] border p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        active ? "border-rose-500 bg-rose-50" : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-black">{value}</h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            active ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-500"
          }`}
        >
          <Icon size={24} />
        </div>
      </div>
    </button>
  );
}
