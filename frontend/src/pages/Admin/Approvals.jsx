import { useMemo, useState } from "react";
import {
  Search,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Home,
  Compass,
  MoreVertical,
  X,
  Eye,
  Trash2,
} from "lucide-react";

const approvalsData = [
  {
    id: "APR-1001",
    title: "Luxury Beach House",
    type: "Property",
    submittedBy: "Rahul Sharma",
    location: "Goa, India",
    status: "Pending",
    date: "Jun 15, 2026",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=900",
  },
  {
    id: "APR-1002",
    title: "Mumbai Food Walk",
    type: "Experience",
    submittedBy: "Sneha Verma",
    location: "Mumbai, India",
    status: "Pending",
    date: "Jun 16, 2026",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=900",
  },
  {
    id: "APR-1003",
    title: "Mountain Cabin Stay",
    type: "Property",
    submittedBy: "Amit Kumar",
    location: "Manali, India",
    status: "Rejected",
    date: "Jun 18, 2026",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900",
  },
];

export default function Approval() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  const approvals = useMemo(() => {
    return approvalsData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());

      const matchesType = type === "All" || item.type === type;
      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, type, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Approval Center
          </h1>
          <p className="mt-1 text-gray-500">
            Review pending properties and experiences before they go public.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export Approvals
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Pending" value="42" icon={Clock} />
        <StatCard title="Approved" value="410" icon={CheckCircle} />
        <StatCard title="Rejected" value="24" icon={XCircle} />
        <StatCard title="Listings" value="476" icon={Home} />
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
              placeholder="Search approvals..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Property</option>
            <option>Experience</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {approvals.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-[1.8rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-56">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />

              <StatusBadge status={item.status} />

              <button
                onClick={() => setSelectedItem(item)}
                className="absolute right-4 top-4 rounded-full bg-white/90 p-2 transition hover:bg-white"
              >
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2">
                {item.type === "Property" ? (
                  <Home size={17} className="text-rose-500" />
                ) : (
                  <Compass size={17} className="text-rose-500" />
                )}

                <span className="text-sm font-black text-gray-500">
                  {item.type}
                </span>
              </div>

              <h2 className="mt-3 truncate text-lg font-black">{item.title}</h2>

              <p className="mt-1 text-sm text-gray-500">
                Submitted by {item.submittedBy}
              </p>

              <p className="mt-3 text-sm font-semibold text-gray-600">
                {item.location}
              </p>

              <div className="mt-5 flex gap-2">
                <button className="flex-1 rounded-xl bg-emerald-500 py-2 text-sm font-bold text-white hover:bg-emerald-600">
                  Approve
                </button>

                <button className="flex-1 rounded-xl bg-red-50 py-2 text-sm font-bold text-red-600 hover:bg-red-100">
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <ApprovalDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

function ApprovalDrawer({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Approval Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <img
          src={item.image}
          alt={item.title}
          className="mt-6 h-64 w-full rounded-[1.5rem] object-cover"
        />

        <div className="mt-6">
          <h3 className="text-2xl font-black">{item.title}</h3>
          <p className="mt-1 text-gray-500">Submitted by {item.submittedBy}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="ID" value={item.id} />
          <Info title="Type" value={item.type} />
          <Info title="Location" value={item.location} />
          <Info title="Date" value={item.date} />
          <Info title="Status" value={item.status} />
          <Info title="Submitted By" value={item.submittedBy} />
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800">
            <Eye size={18} />
            View Full Listing
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-white hover:bg-emerald-600">
            <CheckCircle size={18} />
            Approve
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-bold text-red-600 hover:bg-red-100">
            <XCircle size={18} />
            Reject
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Delete Request
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
    status === "Approved"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Pending"
        ? "bg-yellow-50 text-yellow-600"
        : "bg-red-50 text-red-600";

  return (
    <span
      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black ${style}`}
    >
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
