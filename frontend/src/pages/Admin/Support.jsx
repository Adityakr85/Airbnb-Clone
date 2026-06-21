import { useMemo, useState } from "react";
import {
  Search,
  Download,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  X,
  Send,
  User,
  Mail,
  Trash2,
} from "lucide-react";

const ticketsData = [
  {
    id: "TKT-1001",
    user: "Rahul Sharma",
    email: "rahul@gmail.com",
    subject: "Refund not received",
    message: "I cancelled my booking 5 days ago but refund is still pending.",
    category: "Payment",
    priority: "High",
    status: "Open",
    date: "Jun 15, 2026",
  },
  {
    id: "TKT-1002",
    user: "Sneha Verma",
    email: "sneha@gmail.com",
    subject: "Unable to message host",
    message: "The message button is not working for my reservation.",
    category: "Messaging",
    priority: "Medium",
    status: "In Progress",
    date: "Jun 16, 2026",
  },
  {
    id: "TKT-1003",
    user: "Amit Kumar",
    email: "amit@gmail.com",
    subject: "Property location is incorrect",
    message: "The location shown on map is different from actual location.",
    category: "Listing",
    priority: "Low",
    status: "Resolved",
    date: "Jun 18, 2026",
  },
];

export default function Support() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = useMemo(() => {
    return ticketsData.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.user.toLowerCase().includes(search.toLowerCase()) ||
        item.subject.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Support</h1>
          <p className="mt-1 text-gray-500">
            Manage user tickets, complaints, questions, and support requests.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export Tickets
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Tickets" value="312" icon={MessageCircle} />
        <StatCard title="Open" value="46" icon={AlertCircle} />
        <StatCard title="In Progress" value="28" icon={Clock} />
        <StatCard title="Resolved" value="238" icon={CheckCircle} />
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
              placeholder="Search tickets..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5">
        {tickets.map((item) => (
          <div
            key={item.id}
            className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-black text-gray-950">
                    {item.id}
                  </h2>
                  <StatusBadge status={item.status} />
                  <PriorityBadge priority={item.priority} />
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600">
                    {item.category}
                  </span>
                </div>

                <p className="mt-3 font-bold text-gray-950">{item.subject}</p>

                <p className="mt-1 text-sm text-gray-500">
                  From {item.user} · {item.date}
                </p>

                <p className="mt-4 max-w-3xl text-gray-700">{item.message}</p>
              </div>

              <button
                onClick={() => setSelectedTicket(item)}
                className="rounded-full p-2 transition hover:bg-gray-100"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTicket && (
        <TicketDrawer
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}

function TicketDrawer({ ticket, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Support Ticket</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-gray-950 to-rose-600 p-6 text-white">
          <p className="text-sm font-semibold text-white/70">Ticket ID</p>
          <h3 className="mt-1 text-3xl font-black">{ticket.id}</h3>
          <p className="mt-2 text-white/80">{ticket.subject}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="User" value={ticket.user} />
          <Info title="Email" value={ticket.email} />
          <Info title="Category" value={ticket.category} />
          <Info title="Priority" value={ticket.priority} />
          <Info title="Status" value={ticket.status} />
          <Info title="Date" value={ticket.date} />
        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-bold uppercase text-gray-400">Message</p>
          <p className="mt-2 text-sm font-medium text-gray-700">
            {ticket.message}
          </p>
        </div>

        <div className="mt-6">
          <textarea
            rows="5"
            placeholder="Write admin reply..."
            className="w-full resize-none rounded-2xl border border-gray-200 p-4 outline-none focus:border-rose-500"
          />
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600">
            <Send size={18} />
            Send Reply
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800">
            <Mail size={18} />
            Email User
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 font-bold text-emerald-600 hover:bg-emerald-100">
            <CheckCircle size={18} />
            Mark Resolved
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Delete Ticket
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
    status === "Resolved"
      ? "bg-emerald-50 text-emerald-600"
      : status === "In Progress"
        ? "bg-yellow-50 text-yellow-600"
        : "bg-red-50 text-red-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const style =
    priority === "High"
      ? "bg-red-50 text-red-600"
      : priority === "Medium"
        ? "bg-yellow-50 text-yellow-600"
        : "bg-blue-50 text-blue-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {priority}
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
