import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "../../api/notifications";

export default function Notifications() {
  const { user, isLoaded } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadNotifications() {
      if (!isLoaded || !user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await fetchNotifications(user.id);
        setNotifications(data);
      } catch (err) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    }
    
    loadNotifications();
  }, [user?.id, isLoaded]);

  const handleDelete = async (id) => {
    if (!user?.id) return;
    
    try {
      await deleteNotification(user.id, id);
      const updated = notifications.filter((item) => item.id !== id);
      setNotifications(updated);
      if (selected?.id === id) {
        setSelected(updated[0] || null);
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    if (!user?.id) return;
    
    try {
      await markNotificationAsRead(user.id, id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      if (selected?.id === id) {
        setSelected({ ...selected, is_read: true });
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      if (selected) {
        setSelected({ ...selected, is_read: true });
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  if (!isLoaded) {
    return <div className="p-10 text-center font-semibold">Loading...</div>;
  }

  if (!user?.id) {
    return (
      <div className="h-[calc(100vh-80px)] flex bg-white">
        <div className="w-[375px] border-r border-gray-200 p-8">
          <h1 className="text-2xl font-semibold">Notifications</h1>
        </div>
        <main className="flex-1 flex flex-col items-center justify-center text-center">
          <Bell size={60} className="text-gray-300 mb-5" />
          <h2 className="text-2xl font-semibold">Please sign in</h2>
          <p className="mt-2 text-gray-500">You need to be signed in to view notifications.</p>
        </main>
      </div>
    );
  }

  if (loading) {
    return <div className="h-[calc(100vh-80px)] flex items-center justify-center"><div className="text-gray-600">Loading notifications...</div></div>;
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex bg-white">
      {/* Left Panel */}
      <aside className="w-[375px] border-r border-gray-200 flex flex-col">
        <div className="p-8 border-b border-gray-200">
          <h1 className="text-2xl font-semibold">Notifications</h1>
          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="mt-2 text-sm text-rose-500 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {notifications.length === 0 ? (
            <div className="pt-24 text-center px-8">
              <Bell className="mx-auto mb-4" size={36} />
              <h2 className="font-semibold">No notifications yet</h2>
              <p className="text-gray-500 mt-2">
                Your notifications will appear here.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => { setSelected(item); handleMarkAsRead(item.id); }}
                className={`group flex items-start justify-between gap-3 rounded-2xl px-4 py-4 cursor-pointer transition ${
                  selected?.id === item.id ? "bg-gray-100" : "hover:bg-gray-50"
                } ${!item.is_read ? "bg-rose-50" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                  <h3 className={`font-semibold ${!item.is_read ? "text-gray-950" : "text-gray-700"}`}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">{item.date}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="mt-1 rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-black opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Right Detail Panel */}
      <main className="flex-1 flex flex-col">
        {selected ? (
          <div className="flex-1 p-10 max-w-3xl mx-auto w-full">
            <p className="text-sm text-gray-500 capitalize">{selected.type}</p>

            <h2 className="mt-2 text-3xl font-semibold">{selected.title}</h2>

            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              {selected.message}
            </p>

            <p className="mt-10 text-sm text-gray-400">{selected.date}</p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Bell size={60} className="text-gray-300 mb-5" />

            <h2 className="text-2xl font-semibold">Select a notification</h2>

            <p className="mt-2 text-gray-500">
              Click a notification from the left panel to view its details.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
