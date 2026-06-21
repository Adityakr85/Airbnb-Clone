import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Flag,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreVertical,
  X,
  Eye,
  ShieldCheck,
  Trash2,
} from "lucide-react";

const reportsData = [
  {
    id: "REP-1001",
    reportedBy: "Rahul Sharma",
    reportedEmail: "rahul@gmail.com",
    target: "Luxury Villa in Goa",
    targetType: "Property",
    reason: "Misleading photos",
    description: "The property photos do not match the actual place.",
    status: "Open",
    priority: "High",
    date: "Jun 15, 2026",
  },
  {
    id: "REP-1002",
    reportedBy: "Sneha Verma",
    reportedEmail: "sneha@gmail.com",
    target: "Mumbai Street Food Tour",
    targetType: "Experience",
    reason: "Host was late",
    description: "The host arrived 45 minutes late without informing guests.",
    status: "Under Review",
    priority: "Medium",
    date: "Jun 16, 2026",
  },
  {
    id: "REP-1003",
    reportedBy: "Amit Kumar",
    reportedEmail: "amit@gmail.com",
    target: "User Review",
    targetType: "Review",
    reason: "Abusive language",
    description: "The review contains offensive and abusive language.",
    status: "Resolved",
    priority: "Low",
    date: "Jun 18, 2026",
  },
];

export default function Reports() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = useMemo(() => {
    return reportsData.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.reportedBy.toLowerCase().includes(search.toLowerCase()) ||
        item.target.toLowerCase().includes(search.toLowerCase()) ||
        item.reason.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Reports</h1>
          <p className="mt-1 text-gray-500">
            Review user reports, flagged listings, abuse cases, and platform
            issues.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export Reports
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Reports" value="186" icon={Flag} />
        <StatCard title="Open" value="42" icon={AlertTriangle} />
        <StatCard title="Under Review" value="31" icon={Clock} />
        <StatCard title="Resolved" value="113" icon={CheckCircle} />
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
              placeholder="Search reports, users, target, or reason..."
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
            <option>Under Review</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5">
        {reports.map((item) => (
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
                    {item.targetType}
                  </span>
                </div>

                <p className="mt-3 font-bold text-gray-950">{item.reason}</p>

                <p className="mt-1 text-sm text-gray-500">
                  Reported by {item.reportedBy} · {item.date}
                </p>

                <p className="mt-4 max-w-3xl text-gray-700">
                  {item.description}
                </p>

                <p className="mt-3 text-sm font-semibold text-gray-500">
                  Target: <span className="text-gray-900">{item.target}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(item)}
                className="rounded-full p-2 transition hover:bg-gray-100"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <ReportDrawer
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

function ReportDrawer({ report, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Report Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-red-500 to-orange-400 p-6 text-white">
          <p className="text-sm font-semibold text-white/80">Report ID</p>
          <h3 className="mt-1 text-3xl font-black">{report.id}</h3>
          <p className="mt-2 text-white/90">{report.reason}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <StatusBadge status={report.status} />
          <PriorityBadge priority={report.priority} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="Reported By" value={report.reportedBy} />
          <Info title="Email" value={report.reportedEmail} />
          <Info title="Target" value={report.target} />
          <Info title="Type" value={report.targetType} />
          <Info title="Date" value={report.date} />
          <Info title="Priority" value={report.priority} />
        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-bold uppercase text-gray-400">
            Description
          </p>
          <p className="mt-2 text-sm font-medium text-gray-700">
            {report.description}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800">
            <Eye size={18} />
            View Target
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-50 px-5 py-3 font-bold text-yellow-700 hover:bg-yellow-100">
            <Clock size={18} />
            Mark Under Review
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-white hover:bg-emerald-600">
            <ShieldCheck size={18} />
            Mark Resolved
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Delete Report
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
      : status === "Under Review"
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
