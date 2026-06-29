import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Trash2,
  Send,
  Bug,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../api/notifications";

const FILTERS = [
  { label: "All", icon: Bell },
  { label: "Feedback", icon: Send },
  { label: "Bug report", icon: Bug },
  { label: "Support", icon: ShieldCheck },
  { label: "Booking", icon: CalendarCheck },
];

function getNotificationIcon(type) {
  const lowerType = (type || "").toLowerCase();

  if (lowerType === "feedback") return <Star size={19} />;
  if (lowerType === "bug report") return <Bug size={19} />;
  if (lowerType === "support") return <ShieldCheck size={19} />;
  if (lowerType === "booking") return <CalendarCheck size={19} />;

  return <Bell size={19} />;
}

export default function Notifications() {
  const { user, isLoaded } = useUser();

  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);

  const [filter, setFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotifications() {
      if (!isLoaded || !user?.id) return;

      try {
        setLoading(true);
        setError("");

        const data = await fetchNotifications(user.id);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setNotifications(list);
      } catch (err) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [isLoaded, user?.id]);

  const filteredNotifications = notifications.filter((item) => {
    const type = item.type || "";
    const title = item.title || "";
    const message = item.message || "";

    const matchesFilter =
      filter === "All" ||
      (filter === "Unread" && !item.is_read) ||
      type.toLowerCase() === filter.toLowerCase();

    const query = searchText.trim().toLowerCase();

    const matchesSearch =
      !query ||
      title.toLowerCase().includes(query) ||
      message.toLowerCase().includes(query) ||
      type.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const handleSelect = async (item) => {
    setSelected(item);

    if (!user?.id || item.is_read) return;

    try {
      await markNotificationAsRead(user.id, item.id);

      const updatedItem = { ...item, is_read: true };

      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? updatedItem : n)),
      );

      setSelected(updatedItem);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!user?.id) return;

    try {
      await deleteNotification(user.id, id);

      const updated = notifications.filter((item) => item.id !== id);
      setNotifications(updated);

      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await markAllNotificationsAsRead(user.id);

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, is_read: true })),
      );

      if (selected) {
        setSelected({ ...selected, is_read: true });
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-white">
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white">
      <aside className="flex w-[375px] flex-col border-r border-gray-200">
        <div className="border-b border-gray-100 p-8">
          {!searchOpen ? (
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold">Notifications</h1>

              <div className="flex items-center gap-3">
                {notifications.some((item) => !item.is_read) && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold transition hover:border-black hover:bg-gray-50"
                  >
                    Mark all as read
                  </button>
                )}

                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex h-12 flex-1 items-center gap-2 rounded-full border-2 border-[#222] px-4">
                <Search size={20} />

                <input
                  autoFocus
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search notifications"
                  className="w-full outline-none"
                />
              </div>

              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchText("");
                }}
                className="font-medium"
              >
                Cancel
              </button>
            </div>
          )}

          {!searchOpen && (
            <div className="relative mt-7 flex gap-3">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 rounded-full px-5 py-3 font-medium ${
                  filter !== "Unread"
                    ? "bg-[#222] text-white"
                    : "border border-gray-300 text-black"
                }`}
              >
                {filter === "Unread" ? "All" : filter}
                <ChevronDown size={16} />
              </button>

              <button
                onClick={() => {
                  setFilter("Unread");
                  setFilterOpen(false);
                }}
                className={`rounded-full border px-5 py-3 font-medium ${
                  filter === "Unread"
                    ? "bg-[#222] text-white"
                    : "border-gray-300 text-black"
                }`}
              >
                Unread
              </button>

              {filterOpen && (
                <div className="absolute left-0 top-14 z-30 w-[340px] rounded-2xl bg-white p-3 shadow-xl">
                  {FILTERS.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setFilter(label);
                        setFilterOpen(false);
                      }}
                      className={`flex w-full items-center gap-5 rounded-2xl px-5 py-4 text-left transition hover:bg-gray-100 ${
                        filter === label ? "bg-gray-100 font-semibold" : ""
                      }`}
                    >
                      <Icon size={22} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`group flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-4 transition ${
                  selected?.id === item.id
                    ? "bg-gray-100"
                    : !item.is_read
                      ? "bg-rose-50 hover:bg-rose-100"
                      : "hover:bg-gray-50"
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                  {getNotificationIcon(item.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className={`truncate text-sm ${
                        !item.is_read
                          ? "font-bold text-gray-950"
                          : "font-semibold text-gray-700"
                      }`}
                    >
                      {item.title}
                    </h3>

                    {!item.is_read && (
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />
                    )}
                  </div>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {item.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {item.date || item.created_at}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="rounded-full p-2 text-gray-400 opacity-0 transition hover:bg-gray-200 hover:text-black group-hover:opacity-100"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))
          ) : (
            <div className="px-8 pt-24 text-center">
              <Bell className="mx-auto mb-4" size={36} />
              <h2 className="font-semibold">
                {filter === "Unread"
                  ? "No unread notifications"
                  : "You don’t have any notifications"}
              </h2>
              <p className="mt-2 text-gray-500">
                {searchText
                  ? "No notifications matched your search."
                  : "When a new notification arrives, it will appear here."}
              </p>
            </div>
          )}
        </div>
      </aside>

      <main className="flex flex-1 flex-col bg-white">
        {selected ? (
          <>
            <div className="border-b border-gray-200 px-10 py-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {selected.type}
              </p>

              <h2 className="mt-1 text-xl font-semibold">{selected.title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-10 py-8">
              <div className="max-w-2xl">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                    {getNotificationIcon(selected.type)}
                  </div>

                  <div>
                    <div className="rounded-3xl rounded-tl-md bg-gray-100 px-5 py-4">
                      <p className="leading-relaxed text-gray-800">
                        {selected.message}
                      </p>
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      {selected.date || selected.created_at}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Bell size={64} className="mb-5 text-gray-300" />
            <h2 className="text-2xl font-semibold">Select a notification</h2>
            <p className="mt-2 text-gray-500">
              Choose a notification from the left panel to view details.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
