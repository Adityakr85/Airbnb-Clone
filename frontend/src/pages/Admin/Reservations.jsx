import {
  Search,
  CalendarCheck,
  Clock,
  XCircle,
  CheckCircle,
  MoreVertical,
  IndianRupee,
} from "lucide-react";

const reservations = [
  {
    id: 1,
    guest: "Rahul Sharma",
    host: "Amit Kumar",
    property: "Luxury Villa in Goa",
    checkIn: "Jun 20, 2026",
    checkOut: "Jun 24, 2026",
    amount: "₹45,000",
    status: "Confirmed",
  },
  {
    id: 2,
    guest: "Sneha Verma",
    host: "Priya Singh",
    property: "Modern Apartment in Mumbai",
    checkIn: "Jun 25, 2026",
    checkOut: "Jun 28, 2026",
    amount: "₹24,600",
    status: "Pending",
  },
  {
    id: 3,
    guest: "Amit Kumar",
    host: "Rahul Sharma",
    property: "Mountain Stay in Manali",
    checkIn: "Jul 02, 2026",
    checkOut: "Jul 06, 2026",
    amount: "₹38,000",
    status: "Cancelled",
  },
];

export default function Reservations() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reservations</h1>
        <p className="mt-1 text-gray-500">
          Manage all user bookings, payments, and reservation status.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Bookings" value="876" icon={CalendarCheck} />
        <StatCard title="Confirmed" value="642" icon={CheckCircle} />
        <StatCard title="Pending" value="128" icon={Clock} />
        <StatCard title="Cancelled" value="106" icon={XCircle} />
      </div>

      <div className="flex flex-col gap-4 rounded-[1.7rem] bg-white p-5 shadow-sm lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search reservations..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
          />
        </div>

        <select className="rounded-xl border border-gray-200 px-4 py-3 outline-none">
          <option>All Status</option>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-[1.7rem] bg-white shadow-sm">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Guest</th>
              <th className="px-6 py-4 font-semibold">Host</th>
              <th className="px-6 py-4 font-semibold">Property</th>
              <th className="px-6 py-4 font-semibold">Check-in</th>
              <th className="px-6 py-4 font-semibold">Check-out</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {reservations.map((item) => (
              <tr key={item.id} className="transition hover:bg-gray-50">
                <td className="px-6 py-5 font-semibold text-gray-950">
                  {item.guest}
                </td>

                <td className="px-6 py-5 text-gray-600">{item.host}</td>

                <td className="px-6 py-5 font-medium">{item.property}</td>

                <td className="px-6 py-5 text-gray-600">{item.checkIn}</td>

                <td className="px-6 py-5 text-gray-600">{item.checkOut}</td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-1 font-bold">
                    <IndianRupee size={15} />
                    {item.amount.replace("₹", "")}
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      item.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-600"
                        : item.status === "Pending"
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-red-50 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <button className="rounded-full p-2 transition hover:bg-gray-100">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
