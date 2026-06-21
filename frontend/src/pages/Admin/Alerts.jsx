import { useEffect, useRef, useState } from "react";
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

const adminNotifications = [
  { id: 1, title: "New User Registered", time: "2 mins ago", icon: UserPlus },
  { id: 2, title: "New Booking", time: "10 mins ago", icon: CalendarCheck },
  { id: 3, title: "Property Submitted", time: "18 mins ago", icon: Home },
  { id: 4, title: "Property Approved", time: "32 mins ago", icon: CheckCircle },
  { id: 5, title: "Payment Completed", time: "1 hour ago", icon: CreditCard },
  { id: 6, title: "Refund Requested", time: "2 hours ago", icon: RotateCcw },
  {
    id: 7,
    title: "Support Ticket Opened",
    time: "3 hours ago",
    icon: MessageCircle,
  },
  { id: 8, title: "Review Reported", time: "5 hours ago", icon: Star },
  {
    id: 9,
    title: "Host Verification Submitted",
    time: "Yesterday",
    icon: ShieldCheck,
  },
];

export default function Alerts() {
  const [open, setOpen] = useState(false);
  const alertRef = useRef(null);

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
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-[24rem] rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-950">Notifications</h3>
              <p className="text-xs text-gray-500">
                {adminNotifications.length} admin updates
              </p>
            </div>

            <button className="text-xs font-bold text-rose-500 hover:text-rose-600">
              Mark all read
            </button>
          </div>

          <div className="max-h-[23rem] space-y-2 overflow-y-auto">
            {adminNotifications.map((notification) => {
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
            })}
          </div>

          <button className="mt-4 w-full rounded-2xl bg-gray-950 py-3 text-sm font-bold text-white transition hover:bg-gray-800">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
