import { useMemo, useState } from "react";
import {
  Search,
  Download,
  MoreVertical,
  Users as UsersIcon,
  UserCheck,
  ShieldCheck,
  Ban,
  X,
  Trash2,
} from "lucide-react";

const usersData = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "Host",
    status: "Active",
    verified: true,
    joined: "Jun 10, 2026",
    lastLogin: "Today",
    bookings: 18,
    spent: "₹42,500",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Sneha Verma",
    email: "sneha@gmail.com",
    role: "User",
    status: "Blocked",
    verified: true,
    joined: "May 28, 2026",
    lastLogin: "2 days ago",
    bookings: 7,
    spent: "₹18,200",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@gmail.com",
    role: "Admin",
    status: "Active",
    verified: false,
    joined: "Apr 14, 2026",
    lastLogin: "Yesterday",
    bookings: 0,
    spent: "₹0",
    image: "https://i.pravatar.cc/150?img=8",
  },
];

export default function Users() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  const users = useMemo(() => {
    return usersData.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = role === "All" || user.role === role;
      const matchesStatus = status === "All" || user.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, role, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Users</h1>
          <p className="mt-1 text-gray-500">
            Manage users, hosts, admins, verification, and account access.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export Users
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Users" value="1,248" icon={UsersIcon} />
        <StatCard title="Hosts" value="324" icon={UserCheck} />
        <StatCard title="Admins" value="4" icon={ShieldCheck} />
        <StatCard title="Blocked" value="21" icon={Ban} />
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
              placeholder="Search by name or email..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>User</option>
            <option>Host</option>
            <option>Admin</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Active</option>
            <option>Blocked</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.7rem] border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Verified</th>
                <th className="px-6 py-4 font-bold">Bookings</th>
                <th className="px-6 py-4 font-bold">Spent</th>
                <th className="px-6 py-4 font-bold">Last Login</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-bold text-gray-950">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <Badge type="role">{user.role}</Badge>
                  </td>

                  <td className="px-6 py-5">
                    <Badge type="status">{user.status}</Badge>
                  </td>

                  <td className="px-6 py-5">
                    {user.verified ? (
                      <span className="text-sm font-bold text-emerald-600">
                        Verified
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-yellow-600">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5 font-semibold">{user.bookings}</td>
                  <td className="px-6 py-5 font-bold">{user.spent}</td>
                  <td className="px-6 py-5 text-gray-500">{user.lastLogin}</td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() => setSelectedUser(user)}
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

      {selectedUser && (
        <UserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

function UserDrawer({ user, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">User Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center text-center">
          <img
            src={user.image}
            alt={user.name}
            className="h-24 w-24 rounded-full object-cover"
          />
          <h3 className="mt-4 text-2xl font-black">{user.name}</h3>
          <p className="text-gray-500">{user.email}</p>

          <div className="mt-4 flex gap-2">
            <Badge type="role">{user.role}</Badge>
            <Badge type="status">{user.status}</Badge>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Info title="Joined" value={user.joined} />
          <Info title="Last Login" value={user.lastLogin} />
          <Info title="Bookings" value={user.bookings} />
          <Info title="Total Spent" value={user.spent} />
        </div>

        <div className="mt-8 space-y-3">
          <button className="w-full rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600">
            Make Admin
          </button>
          <button className="w-full rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
            Make Host
          </button>
          <button className="w-full rounded-2xl bg-yellow-50 px-5 py-3 font-bold text-yellow-700 transition hover:bg-yellow-100">
            Block / Unblock
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-bold text-red-600 transition hover:bg-red-100">
            <Trash2 size={18} />
            Delete User
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

function Badge({ children, type }) {
  const styles =
    type === "status"
      ? children === "Active"
        ? "bg-emerald-50 text-emerald-600"
        : "bg-red-50 text-red-600"
      : children === "Admin"
        ? "bg-purple-50 text-purple-600"
        : children === "Host"
          ? "bg-blue-50 text-blue-600"
          : "bg-gray-100 text-gray-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${styles}`}>
      {children}
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
