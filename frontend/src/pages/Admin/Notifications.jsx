import {
  Bell,
  Search,
  Send,
  Users,
  CheckCircle,
  Clock,
  Trash2,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "New booking confirmed",
    message: "Rahul booked Luxury Villa in Goa.",
    audience: "Admin",
    date: "Jun 16, 2026",
    status: "Sent",
  },
  {
    id: 2,
    title: "Property approval pending",
    message: "A new property is waiting for admin approval.",
    audience: "Hosts",
    date: "Jun 17, 2026",
    status: "Pending",
  },
  {
    id: 3,
    title: "Weekend discount offer",
    message: "Special travel offer sent to all users.",
    audience: "All Users",
    date: "Jun 18, 2026",
    status: "Sent",
  },
];

export default function Notifications() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="mt-1 text-gray-500">
          Send announcements and manage platform notifications.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard title="Total Sent" value="1,420" icon={Bell} />
        <StatCard title="Read Rate" value="82%" icon={CheckCircle} />
        <StatCard title="Pending" value="12" icon={Clock} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[1.7rem] bg-white p-6 shadow-sm xl:col-span-1">
          <h2 className="text-xl font-bold">Create Notification</h2>
          <p className="mt-1 text-sm text-gray-500">
            Send a message to users or hosts.
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Notification title"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-rose-500"
            />

            <textarea
              placeholder="Write message..."
              rows="5"
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-rose-500"
            />

            <select className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-rose-500">
              <option>All Users</option>
              <option>Hosts</option>
              <option>Guests</option>
              <option>Admins</option>
            </select>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600">
              <Send size={18} />
              Send Notification
            </button>
          </div>
        </div>

        <div className="rounded-[1.7rem] bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">Recent Notifications</h2>
              <p className="text-sm text-gray-500">
                Track notifications sent across the platform.
              </p>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-rose-500 lg:w-72"
              />
            </div>
          </div>

          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-bold text-gray-950">{item.title}</h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.status === "Sent"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-600">{item.message}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {item.audience}
                      </span>

                      <span>{item.date}</span>
                    </div>
                  </div>

                  <button className="flex h-10 w-10 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
