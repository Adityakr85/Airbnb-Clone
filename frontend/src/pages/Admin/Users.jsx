import { Search, MoreVertical, User, UserCheck, UserX } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "Host",
    status: "Active",
    bookings: 18,
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Sneha Verma",
    email: "sneha@gmail.com",
    role: "User",
    status: "Blocked",
    bookings: 7,
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@gmail.com",
    role: "Admin",
    status: "Active",
    bookings: 0,
    image: "https://i.pravatar.cc/150?img=8",
  },
];

export default function Users() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="mt-1 text-gray-500">
          Manage users, hosts, admins, and account status.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard title="Total Users" value="1,248" icon={User} />
        <StatCard title="Hosts" value="324" icon={UserCheck} />
        <StatCard title="Blocked" value="21" icon={UserX} />
      </div>

      <div className="flex flex-col gap-4 rounded-[1.7rem] bg-white p-5 shadow-sm lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
          />
        </div>

        <select className="rounded-xl border border-gray-200 px-4 py-3 outline-none">
          <option>All Roles</option>
          <option>User</option>
          <option>Host</option>
          <option>Admin</option>
        </select>

        <select className="rounded-xl border border-gray-200 px-4 py-3 outline-none">
          <option>All Status</option>
          <option>Active</option>
          <option>Blocked</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-[1.7rem] bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Bookings</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
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
                      <p className="font-semibold text-gray-950">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-5 font-medium">{user.bookings}</td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      user.status === "Active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {user.status}
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
