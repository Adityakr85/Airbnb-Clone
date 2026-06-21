import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Bell,
  Send,
  Users,
  CheckCircle,
  Clock,
  Trash2,
  MoreVertical,
  X,
  Eye,
} from "lucide-react";

const notificationsData = [
  {
    id: "NOT-1001",
    title: "New booking confirmed",
    message: "Rahul booked Luxury Villa in Goa.",
    audience: "Admin",
    status: "Sent",
    type: "Booking",
    date: "Jun 15, 2026",
  },
  {
    id: "NOT-1002",
    title: "Property approval pending",
    message: "A new property is waiting for admin approval.",
    audience: "Hosts",
    status: "Pending",
    type: "Approval",
    date: "Jun 16, 2026",
  },
  {
    id: "NOT-1003",
    title: "Weekend discount offer",
    message: "Special travel offer sent to all users.",
    audience: "All Users",
    status: "Sent",
    type: "Promotion",
    date: "Jun 18, 2026",
  },
];

export default function Notifications() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedNotification, setSelectedNotification] = useState(null);

  const notifications = useMemo(() => {
    return notificationsData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.message.toLowerCase().includes(search.toLowerCase()) ||
        item.audience.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
          <p className="mt-1 text-gray-500">
            Create, send, and manage platform notifications.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Sent" value="1,420" icon={Bell} />
        <StatCard title="Read Rate" value="82%" icon={CheckCircle} />
        <StatCard title="Pending" value="12" icon={Clock} />
        <StatCard title="Audiences" value="4" icon={Users} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Create Notification</h2>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Notification title"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
            />

            <textarea
              rows="5"
              placeholder="Write message..."
              className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
            />

            <select className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500">
              <option>All Users</option>
              <option>Guests</option>
              <option>Hosts</option>
              <option>Admins</option>
            </select>

            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-black text-white transition hover:bg-rose-600">
              <Send size={18} />
              Send Notification
            </button>
          </div>
        </div>

        <div className="space-y-5 xl:col-span-2">
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
                  placeholder="Search notifications..."
                  className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
                />
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
              >
                <option>All</option>
                <option>Sent</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          {notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-black text-gray-950">{item.title}</h2>
                    <StatusBadge status={item.status} />
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600">
                      {item.type}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600">{item.message}</p>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-gray-500">
                    <span>Audience: {item.audience}</span>
                    <span>Date: {item.date}</span>
                    <span>ID: {item.id}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNotification(item)}
                  className="rounded-full p-2 transition hover:bg-gray-100"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNotification && (
        <NotificationDrawer
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
}

function NotificationDrawer({ notification, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Notification Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-rose-500 to-orange-400 p-6 text-white">
          <p className="text-sm font-semibold text-white/80">Notification ID</p>
          <h3 className="mt-1 text-3xl font-black">{notification.id}</h3>
          <p className="mt-2 text-white/90">{notification.title}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="Audience" value={notification.audience} />
          <Info title="Status" value={notification.status} />
          <Info title="Type" value={notification.type} />
          <Info title="Date" value={notification.date} />
        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-bold uppercase text-gray-400">Message</p>
          <p className="mt-2 text-sm font-medium text-gray-700">
            {notification.message}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600">
            <Send size={18} />
            Send Now
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800">
            <Eye size={18} />
            Preview
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Delete Notification
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
    status === "Sent"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-yellow-50 text-yellow-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {status}
    </span>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-black">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
