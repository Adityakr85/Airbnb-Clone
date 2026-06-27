import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import {
  Bell,
  UserPlus,
  CalendarCheck,
  Home,
  CheckCircle,
  CreditCard,
  RotateCcw,
  MessageCircle,
  Star,
  ShieldCheck,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const iconMap = {
  user_plus: UserPlus,
  calendar_check: CalendarCheck,
  home: Home,
  check_circle: CheckCircle,
  credit_card: CreditCard,
  rotate_ccw: RotateCcw,
  message_circle: MessageCircle,
  star: Star,
  shield_check: ShieldCheck,
  property_submitted: Home,
  property_approved: CheckCircle,
  property_rejected: Home,
  new_reservation: CalendarCheck,
  reservation_confirmed: CheckCircle,
  reservation_cancelled: RotateCcw,
  reservation_completed: CheckCircle,
  guest_cancelled: UserPlus,
  admin_test: ShieldCheck,
};

export default function Alerts() {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const alertRef = useRef(null);

  useEffect(() => {
    async function fetchAdminNotifications() {
      if (!isLoaded || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        const role = user?.publicMetadata?.role;
        const res = await axios.get(`${API_BASE}/api/admin/notifications`, {
          params: { clerk_id: user.id, role },
        });
        const data = res.data?.data?.data || res.data?.data || [];
        
        // Take only first 10 notifications for dropdown
        const formatted = data.slice(0, 10).map((n) => ({
          id: n.id,
          title: n.title,
          time: n.created_at ? new Date(n.created_at).toLocaleString() : 'Unknown',
          icon: iconMap[n.type] || Bell,
        }));
        setNotifications(formatted);
      } catch (err) {
        console.error("Failed to fetch admin notifications:", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminNotifications();
  }, [isLoaded, user?.id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={alertRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-[24rem] rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-950">Notifications</h3>
              <p className="text-xs text-gray-500">
                {loading ? "Loading..." : `${notifications.length} admin updates`}
              </p>
            </div>

            <button className="text-xs font-bold text-rose-500 hover:text-rose-600">
              Mark all read
            </button>
          </div>

          <div className="max-h-[23rem] space-y-2 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-4 text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">No notifications</div>
            ) : (
              notifications.map((notification) => {
                const Icon = notification.icon;

                return (
                  <button
                    key={notification.id}
                    className="flex w-full items-start gap-3 rounded-2xl p-3 text-left transition hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                      <Icon size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-950">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <button className="mt-4 w-full rounded-2xl bg-gray-950 py-3 text-sm font-bold text-white transition hover:bg-gray-800">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
