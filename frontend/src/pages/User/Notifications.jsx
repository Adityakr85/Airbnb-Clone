import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];

    setNotifications(stored);
    setSelected(null);
  }, []);

  const deleteNotification = (id) => {
    const updated = notifications.filter((item) => item.id !== id);

    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));

    if (selected?.id === id) {
      setSelected(updated[0] || null);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex bg-white">
      {/* Left Panel */}
      <aside className="w-[375px] border-r border-gray-200">
        <div className="p-8">
          <h1 className="text-2xl font-semibold">Notifications</h1>
        </div>

        <div className="px-4">
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
                onClick={() => setSelected(item)}
                className={`group flex items-start justify-between gap-3 rounded-2xl px-4 py-4 cursor-pointer transition ${
                  selected?.id === item.id ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex-1">
                  <p className="text-xs text-gray-500">{item.type}</p>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">{item.date}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item.id);
                  }}
                  className="mt-1 rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-black"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Right Detail Panel */}
      <main className="flex-1">
        {selected ? (
          <div className="p-10 max-w-3xl">
            <p className="text-sm text-gray-500">{selected.type}</p>

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
