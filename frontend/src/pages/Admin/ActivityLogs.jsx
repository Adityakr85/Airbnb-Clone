import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Shield,
  User,
  Home,
  CreditCard,
  CheckCircle,
  Trash2,
  Clock,
  Eye,
} from "lucide-react";

const logsData = [
  {
    id: "LOG-1001",
    admin: "Himanshu Paul",
    action: "Approved Property",
    target: "Luxury Villa Goa",
    category: "Property",
    timestamp: "2026-06-20 10:45 AM",
    status: "Success",
  },
  {
    id: "LOG-1002",
    admin: "Admin User",
    action: "Deleted Review",
    target: "Review #445",
    category: "Review",
    timestamp: "2026-06-20 09:20 AM",
    status: "Success",
  },
  {
    id: "LOG-1003",
    admin: "Super Admin",
    action: "Refund Processed",
    target: "Reservation RSV-1001",
    category: "Financial",
    timestamp: "2026-06-19 08:10 PM",
    status: "Success",
  },
  {
    id: "LOG-1004",
    admin: "Moderator",
    action: "Login Attempt",
    target: "Admin Dashboard",
    category: "Security",
    timestamp: "2026-06-19 05:30 PM",
    status: "Failed",
  },
];

export default function ActivityLogs() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const logs = useMemo(() => {
    return logsData.filter((item) => {
      const matchesSearch =
        item.admin.toLowerCase().includes(search.toLowerCase()) ||
        item.action.toLowerCase().includes(search.toLowerCase()) ||
        item.target.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" || item.category === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black">Activity Logs</h1>

          <p className="mt-1 text-gray-500">
            Complete audit trail of all admin activities.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800">
          <Download size={18} />
          Export Logs
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Logs" value="24,892" icon={Clock} />

        <StatCard title="Admin Actions" value="12,420" icon={Shield} />

        <StatCard title="Approvals" value="5,142" icon={CheckCircle} />

        <StatCard title="Deletions" value="1,024" icon={Trash2} />
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
              placeholder="Search logs..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-rose-500"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>Property</option>
            <option>Review</option>
            <option>Financial</option>
            <option>Security</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.7rem] border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-black">ID</th>

                <th className="px-6 py-4 text-left text-sm font-black">
                  Admin
                </th>

                <th className="px-6 py-4 text-left text-sm font-black">
                  Action
                </th>

                <th className="px-6 py-4 text-left text-sm font-black">
                  Target
                </th>

                <th className="px-6 py-4 text-left text-sm font-black">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-sm font-black">Time</th>

                <th className="px-6 py-4 text-left text-sm font-black">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-black">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-5 font-black">{log.id}</td>

                  <td className="px-6 py-5">{log.admin}</td>

                  <td className="px-6 py-5 font-semibold">{log.action}</td>

                  <td className="px-6 py-5">{log.target}</td>

                  <td className="px-6 py-5">
                    <CategoryBadge category={log.category} />
                  </td>

                  <td className="px-6 py-5 text-gray-500">{log.timestamp}</td>

                  <td className="px-6 py-5">
                    <StatusBadge status={log.status} />
                  </td>

                  <td className="px-6 py-5">
                    <button className="rounded-full p-2 hover:bg-gray-100">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CategoryBadge({ category }) {
  const styles = {
    Property: "bg-blue-50 text-blue-600",
    Review: "bg-purple-50 text-purple-600",
    Financial: "bg-emerald-50 text-emerald-600",
    Security: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${styles[category]}`}
    >
      {category}
    </span>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "Success"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-red-50 text-red-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {status}
    </span>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
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
