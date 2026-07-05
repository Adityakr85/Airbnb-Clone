import { useMemo, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
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
import {
  fetchAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  deleteAdminUser,
} from "../../api/admin";

const ROLE_LEVELS = {
  guest: 1,
  host: 2,
  moderator: 3,
  support: 4,
  finance: 5,
  manager: 6,
  admin: 7,
};

const ROLE_OPTIONS = [
  { value: "guest", label: "Guest" },
  { value: "host", label: "Host" },
  { value: "moderator", label: "Moderator" },
  { value: "support", label: "Support" },
  { value: "finance", label: "Finance" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

function normalizeRole(value) {
  return String(value || "").toLowerCase();
}

function normalizeStatus(value) {
  return String(value || "").toLowerCase();
}

function formatLabel(value) {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

export default function Users() {
  const { user, isLoaded } = useUser();

  const currentRole = normalizeRole(user?.publicMetadata?.role);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [activeStat, setActiveStat] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      if (!isLoaded) return;

      const clerkId = user?.id;

      if (!clerkId) {
        setUsers([]);
        setError("Unable to load users: User not authenticated");
        return;
      }

      const data = await fetchAdminUsers(clerkId);
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load users. Please try again later.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const intervalId = setInterval(fetchUsers, 5000);

    return () => clearInterval(intervalId);
  }, [isLoaded, user?.id]);

  const handleStatFilter = (filter) => {
    setActiveStat(filter);
    setSearch("");

    if (filter === "all") {
      setRole("all");
      setStatus("all");
    }

    if (filter === "hosts") {
      setRole("host");
      setStatus("all");
    }

    if (filter === "admins") {
      setRole("admin");
      setStatus("all");
    }

    if (filter === "blocked") {
      setRole("all");
      setStatus("blocked");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const name = String(item.name || "").toLowerCase();
      const email = String(item.email || "").toLowerCase();
      const username = String(item.username || "").toLowerCase();

      const itemRole = normalizeRole(item.role);
      const itemStatus = normalizeStatus(item.raw_status || item.status);

      const searchValue = search.toLowerCase();

      const matchesSearch =
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        username.includes(searchValue);

      const matchesRole = role === "all" || itemRole === role;
      const matchesStatus = status === "all" || itemStatus === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  const stats = {
    total: users.length,
    hosts: users.filter((item) => normalizeRole(item.role) === "host").length,
    admins: users.filter((item) => normalizeRole(item.role) === "admin").length,
    blocked: users.filter(
      (item) => normalizeStatus(item.raw_status || item.status) === "blocked",
    ).length,
  };

  const refreshSelectedUser = (updatedUser) => {
    if (!updatedUser) return;

    setUsers((prev) =>
      prev.map((item) =>
        item.id === updatedUser.id
          ? {
              ...item,
              ...updatedUser,
              status:
                updatedUser.status === "blocked"
                  ? "Blocked"
                  : formatLabel(updatedUser.status),
              raw_status: updatedUser.status,
            }
          : item,
      ),
    );

    setSelectedUser((prev) =>
      prev && prev.id === updatedUser.id
        ? {
            ...prev,
            ...updatedUser,
            status:
              updatedUser.status === "blocked"
                ? "Blocked"
                : formatLabel(updatedUser.status),
            raw_status: updatedUser.status,
          }
        : prev,
    );
  };

  const handleRoleUpdate = async (targetUser, nextRole) => {
    try {
      setActionLoading(true);

      const res = await updateAdminUserRole(user.id, targetUser.id, nextRole);

      toast.success(res.message || "Role updated");
      refreshSelectedUser(res.data);
      await fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (targetUser) => {
    try {
      setActionLoading(true);

      const currentStatus = normalizeStatus(
        targetUser.raw_status || targetUser.status,
      );

      const nextStatus = currentStatus === "blocked" ? "active" : "blocked";

      const res = await updateAdminUserStatus(
        user.id,
        targetUser.id,
        nextStatus,
      );

      toast.success(res.message || "Status updated");
      refreshSelectedUser(res.data);
      await fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    const confirmDelete = window.confirm(
      `Delete ${targetUser.name}? This cannot be undone.`,
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(true);

      const res = await deleteAdminUser(user.id, targetUser.id);

      toast.success(res.message || "User deleted");
      setSelectedUser(null);
      setUsers((prev) => prev.filter((item) => item.id !== targetUser.id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center font-bold text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Users</h1>
          <p className="mt-1 text-gray-500">
            Manage users, hosts, roles, verification, and account access.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export Users
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={UsersIcon}
          active={activeStat === "all"}
          onClick={() => handleStatFilter("all")}
        />
        <StatCard
          title="Hosts"
          value={stats.hosts}
          icon={UserCheck}
          active={activeStat === "hosts"}
          onClick={() => handleStatFilter("hosts")}
        />
        <StatCard
          title="Admins"
          value={stats.admins}
          icon={ShieldCheck}
          active={activeStat === "admins"}
          onClick={() => handleStatFilter("admins")}
        />
        <StatCard
          title="Blocked"
          value={stats.blocked}
          icon={Ban}
          active={activeStat === "blocked"}
          onClick={() => handleStatFilter("blocked")}
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
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveStat("custom");
              }}
              type="text"
              placeholder="Search by name, username, or email..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setActiveStat("custom");
            }}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option value="all">All Roles</option>
            {ROLE_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setActiveStat("custom");
            }}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedUser(item)}
                    className="cursor-pointer transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />

                        <div>
                          <p className="font-bold text-gray-950">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.email}</p>
                          {item.username && (
                            <p className="text-xs font-semibold text-gray-400">
                              @{item.username}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <Badge type="role">{item.role}</Badge>
                    </td>

                    <td className="px-6 py-5">
                      <Badge type="status">
                        {item.raw_status || item.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-5">
                      {item.verified ? (
                        <span className="text-sm font-bold text-emerald-600">
                          Verified
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-yellow-600">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 font-semibold">{item.bookings}</td>
                    <td className="px-6 py-5 font-bold">{item.spent}</td>
                    <td className="px-6 py-5 text-gray-500">
                      {item.lastLogin}
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(item);
                        }}
                        className="rounded-full p-2 transition hover:bg-gray-100"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center font-semibold text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          currentRole={currentRole}
          actionLoading={actionLoading}
          onClose={() => setSelectedUser(null)}
          onRoleUpdate={handleRoleUpdate}
          onStatusUpdate={handleStatusUpdate}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  );
}

function UserDrawer({
  user,
  currentRole,
  actionLoading,
  onClose,
  onRoleUpdate,
  onStatusUpdate,
  onDeleteUser,
}) {
  const actorLevel = ROLE_LEVELS[currentRole] || 0;
  const targetRole = normalizeRole(user.role);
  const targetLevel = ROLE_LEVELS[targetRole] || 0;
  const canManage = actorLevel > targetLevel;

  const availableRoles = ROLE_OPTIONS.filter(
    (role) => ROLE_LEVELS[role.value] < actorLevel,
  );

  const currentStatus = normalizeStatus(user.raw_status || user.status);
  const isBlocked = currentStatus === "blocked";

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
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

          {user.username && (
            <p className="mt-1 text-sm font-semibold text-gray-400">
              @{user.username}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <Badge type="role">{user.role}</Badge>
            <Badge type="status">{user.raw_status || user.status}</Badge>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Info title="Joined" value={user.joined} />
          <Info title="Last Login" value={user.lastLogin} />
          <Info title="Bookings" value={user.bookings} />
          <Info title="Total Spent" value={user.spent} />
        </div>

        <div className="mt-8 rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-black uppercase text-gray-400">
            Role Management
          </p>

          {!canManage ? (
            <p className="mt-3 text-sm font-semibold text-red-500">
              You cannot manage this user because their role is equal to or
              higher than yours.
            </p>
          ) : (
            <>
              <select
                value={targetRole}
                disabled={actionLoading}
                onChange={(e) => onRoleUpdate(user, e.target.value)}
                className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold outline-none transition focus:border-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {availableRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs font-semibold text-gray-400">
                You can only assign roles lower than your own role.
              </p>
            </>
          )}
        </div>

        <div className="mt-8 space-y-3">
          <button
            disabled={!canManage || actionLoading}
            onClick={() => onStatusUpdate(user)}
            className="w-full rounded-2xl bg-yellow-50 px-5 py-3 font-bold text-yellow-700 transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isBlocked ? "Unblock User" : "Block User"}
          </button>

          <button
            disabled={!canManage || actionLoading}
            onClick={() => onDeleteUser(user)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
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
  const value = normalizeRole(children);
  const status = normalizeStatus(children);

  const styles =
    type === "status"
      ? status === "active"
        ? "bg-emerald-50 text-emerald-600"
        : status === "blocked"
          ? "bg-red-50 text-red-600"
          : "bg-yellow-50 text-yellow-600"
      : value === "admin"
        ? "bg-purple-50 text-purple-600"
        : value === "manager"
          ? "bg-indigo-50 text-indigo-600"
          : value === "finance"
            ? "bg-emerald-50 text-emerald-600"
            : value === "support"
              ? "bg-orange-50 text-orange-600"
              : value === "moderator"
                ? "bg-yellow-50 text-yellow-600"
                : value === "host"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-100 text-gray-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${styles}`}>
      {formatLabel(children)}
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
