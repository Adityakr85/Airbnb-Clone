import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Plus, Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import airbnbLogo from "../../assets/Airbnb-logo.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const navLinks = [
  { label: "Dashboard", to: "/host" },
  { label: "Reservations", to: "/host/reservations" },
  { label: "Listings", to: "/host/properties" },
  { label: "Analytics", to: "/host/analytics" },
  { label: "Messages", to: "/host/messages" },
];
const wizardRoutes = ["/become-a-host", "/host/add-property"];

export default function HostLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isSignedIn, isLoaded } = useUser();
  
  const isWizardPage = wizardRoutes.includes(pathname);
  const isAddPropertyPage = pathname === "/host/add-property";

  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [dropdownNotifications, setDropdownNotifications] = useState([]);
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const notificationDropdownRef = useRef(null);

  // Fetch unread notification count
  useEffect(() => {
    async function fetchUnreadCount() {
      if (!isLoaded || !isSignedIn || !user?.id) {
        setUnreadNotifications(0);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/api/notifications/unread-count`, {
          params: { clerk_id: user.id },
        });
        setUnreadNotifications(res.data?.data?.unread_count || 0);
      } catch (err) {
        console.error("Failed to fetch unread notifications:", err);
      }
    }
    fetchUnreadCount();
  }, [isLoaded, isSignedIn, user?.id]);

  // Fetch notifications for dropdown
  const fetchDropdownNotifications = async () => {
    if (!isLoaded || !isSignedIn || !user?.id) return;
    setLoadingDropdown(true);
    try {
      const res = await axios.get(`${API_BASE}/api/notifications`, {
        params: { clerk_id: user.id, unread_only: false },
      });
      setDropdownNotifications(res.data?.data?.data || res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoadingDropdown(false);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await axios.post(`${API_BASE}/api/notifications/read-all`, { clerk_id: user.id });
      setUnreadNotifications(0);
      setDropdownNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setNotificationDropdownOpen(false);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 h-20 border-b border-gray-200 bg-white">
        <div className="flex h-full w-full items-center justify-between px-8">
          <Link to="/" className="flex items-center">
            <img
              src={airbnbLogo}
              alt="Airbnb"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {!isWizardPage && (
            <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
              {navLinks.map(({ label, to }) => {
                const active =
                  pathname === to ||
                  (to !== "/host" && pathname.startsWith(to));

                return (
                  <Link
                    key={label}
                    to={to}
                    className={`px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "border-b-2 border-gray-900 text-gray-900"
                        : "rounded-full text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="ml-auto flex items-center gap-4">
            {isWizardPage ? (
              <>
                <button className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:bg-gray-50">
                  Questions?
                </button>

                <button
                  onClick={() => navigate(isAddPropertyPage ? "/host" : "/")}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
                >
                  {isAddPropertyPage ? "Save & exit" : "Exit"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-sm font-semibold text-gray-700 underline transition hover:text-gray-900"
                >
                  Switch to travelling
                </Link>

                <Link
                  to="/host/add-property"
                  className="flex items-center gap-1.5 rounded-full bg-[#FF385C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#E31C5F]"
                >
                  <Plus size={14} />
                  Add property
                </Link>

                {isSignedIn && (
                  <div ref={notificationDropdownRef} className="relative">
                    <button
                      onClick={() => {
                        setNotificationDropdownOpen((prev) => !prev);
                        if (!notificationDropdownOpen) {
                          fetchDropdownNotifications();
                        }
                      }}
                      className="flex h-11 w-11 items-center justify-center relative rounded-full bg-gray-100 transition hover:bg-gray-200"
                    >
                      <Bell size={22} className="text-gray-700" />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                          {unreadNotifications > 9 ? "9+" : unreadNotifications}
                        </span>
                      )}
                    </button>

                    {notificationDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 z-50 w-[280px] rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-2xl">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="font-black text-gray-950">Notifications</h3>
                          {unreadNotifications > 0 && (
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-xs font-bold text-rose-500 hover:text-rose-600"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>

                        <div className="max-h-[25rem] space-y-2 overflow-y-auto">
                          {loadingDropdown ? (
                            <div className="flex justify-center py-4 text-gray-500">Loading...</div>
                          ) : dropdownNotifications.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 text-sm">No notifications</div>
                          ) : (
                            dropdownNotifications.map((notification) => (
                              <button
                                key={notification.id}
                                className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition hover:bg-gray-50 ${
                                  !notification.is_read ? "bg-rose-50" : ""
                                }`}
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                                  <Bell size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-bold ${!notification.is_read ? "text-gray-950" : "text-gray-700"}`}>
                                    {notification.title}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                                    {notification.message}
                                  </p>
                                </div>
                              </button>
                            ))
                          )}
                        </div>

                        <Link
                          to="/pages/User/Notifications"
                          onClick={() => setNotificationDropdownOpen(false)}
                          className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl bg-gray-950 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
                        >
                          <Bell size={14} />
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
