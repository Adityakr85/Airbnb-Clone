import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Search, Globe, User, Bell, X, Check } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";

import MenuDropdown from "./MenuDropdown";
import SearchBar from "./Search/SearchBar";
import airbnbLogo from "../assets/Airbnb-logo.png";
import LanguageCurrencyModal from "./LanguageCurrencyModal";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const TABS = [
  { icon: "🏠", label: "Homes", path: "/", active: true },
  { icon: "🎈", label: "Experiences", path: "/experiences", badge: "NEW" },
  { icon: "🛎️", label: "Services", path: "/services", badge: "NEW" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isSignedIn, isLoaded } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMenu, setOpenMenu] = useState("null");
  const location = useLocation();

  const [destinationSearch, setDestinationSearch] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [exactDatesFlex, setExactDatesFlex] = useState("exact");

  const [activeTab, setActiveTab] = useState("dates");
  const [stayLength, setStayLength] = useState("week");
  const [flexibleMonths, setFlexibleMonths] = useState([]);

  const [adults, setAdults] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
const [pets, setPets] = useState(0);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const [serviceType, setServiceType] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [dropdownNotifications, setDropdownNotifications] = useState([]);
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const notificationDropdownRef = useRef(null);

  useEffect(() => {
    async function checkHostStatus() {
      if (!isLoaded || !isSignedIn || !user?.id) {
        setIsHost(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/api/host/dashboard`, {
          params: { clerk_id: user.id },
        });

        const properties = res.data?.data?.properties || [];
        setIsHost(res.data?.success && properties.length > 0);
      } catch (err) {
        console.error("Failed to check host status:", err);
        setIsHost(false);
      }
    }

    checkHostStatus();
  }, [isLoaded, isSignedIn, user?.id]);

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
        setUnreadNotifications(res.data?.count || 0);
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

  const hideSearchBar =
    /^\/pages\/User\/(Messages|Notifications|AccountSettings|UserProfile|Trips|BookingDetails|Wishlist)/.test(
      location.pathname,
    );

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      setScrolled(window.scrollY > 70);
      if (Math.abs(window.scrollY - lastY) > 150) setIsExpanded(false);
      lastY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatGuestText = () => {
    const total = adults + childrenCount;
    if (!total && !infants && !pets) return "Add guests";

    const parts = [`${total} guest${total !== 1 ? "s" : ""}`];
    if (infants) parts.push(`${infants} infant${infants !== 1 ? "s" : ""}`);
    if (pets) parts.push(`${pets} pet${pets !== 1 ? "s" : ""}`);

    return parts.join(", ");
  };

  const formatWhenText = () => {
    if (activeTab === "flexible") {
      if (!flexibleMonths.length) return `Any ${stayLength}`;
      const months = flexibleMonths.map((id) =>
        new Date(...id.split("-").reverse()).toLocaleDateString("en-US", {
          month: "short",
        }),
      );
      return `A ${stayLength} in ${months.join(", ")}`;
    }

    if (!checkInDate) return "Anytime";
    const fmt = (d) =>
      d?.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const start = fmt(checkInDate);
    if (!checkOutDate) return start;

    const isSameDay = checkInDate.getTime() === checkOutDate.getTime();
    const isSameMonth =
      checkInDate.getMonth() === checkOutDate.getMonth() &&
      checkInDate.getFullYear() === checkOutDate.getFullYear();

    let text = isSameDay
      ? start
      : isSameMonth
        ? `${start} – ${checkOutDate.getDate()}`
        : `${start} – ${fmt(checkOutDate)}`;
    return exactDatesFlex === "exact"
      ? text
      : `${text} ± ${exactDatesFlex} day${exactDatesFlex === "1" ? "" : "s"}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <nav
        className={`relative flex items-center justify-between px-8 transition-all duration-500 ease-in-out ${
          hideSearchBar ? "h-20" : scrolled && !isExpanded ? "h-20" : "h-25"
        }`}
      >
        <Link to="/" className="z-20 flex items-center">
          <img
            src={airbnbLogo}
            alt="Airbnb"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {!hideSearchBar && (
          <div className="absolute left-1/2 top-1/2 z-50 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            {scrolled && !isExpanded ? (
              <SmallSearchBar
                destination={destinationSearch || "Anywhere"}
                when={formatWhenText()}
                guests={
                  location.pathname.includes("/services")
                    ? serviceType || "Add service"
                    : formatGuestText()
                }
                thirdMenuType={
                  location.pathname.includes("/services") ? "service" : "guests"
                }
                onMenuClick={(menu) => {
                  setIsExpanded(true);
                  setOpenMenu(menu);
                }}
              />
            ) : (
              <div
                className="flex items-center gap-16  transition-all duration-500"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {TABS.map((tab) => (
                  <TopTab
                    key={tab.label}
                    {...tab}
                    active={location.pathname === tab.path}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="z-20 flex items-center gap-4">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="hidden rounded-full px-4 py-3 font-semibold transition hover:bg-gray-100 md:block">
                Become a host
              </button>
            </SignInButton>
          ) : (
            <Link
              to={isHost ? "/host" : "/become-a-host"}
              className="hidden rounded-full px-4 py-3 font-semibold transition hover:bg-gray-100 md:block"
            >
              {isHost ? "Switch to hosting" : "Become a host"}
            </Link>
          )}

          {isSignedIn ? (
            <>
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
              <button
                onClick={() => navigate("/pages/User/UserProfile/Profile")}
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gray-100 transition hover:bg-gray-200"
              >
                <img
                  src={user?.imageUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLanguageModal(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
            >
              <Globe size={21} />
            </button>
          )}
          <MenuDropdown />
        </div>
      </nav>

      {!hideSearchBar && (
        <div
          className={`hidden justify-center transition-all duration-500 ease-in-out md:flex ${scrolled ? "absolute left-0 top-full z-40 w-full bg-white" : "w-full"} ${scrolled && !isExpanded ? "max-h-0 overflow-hidden pb-0 opacity-0" : "max-h-28 overflow-visible pb-8 opacity-100"}`}
        >
          <SearchBar
            setIsExpanded={setIsExpanded}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            destinationSearch={destinationSearch}
            setDestinationSearch={setDestinationSearch}
            checkInDate={checkInDate}
            setCheckInDate={setCheckInDate}
            checkOutDate={checkOutDate}
            setCheckOutDate={setCheckOutDate}
            serviceType={serviceType}
            exactDatesFlex={exactDatesFlex}
            setExactDatesFlex={setExactDatesFlex}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stayLength={stayLength}
            setStayLength={setStayLength}
            flexibleMonths={flexibleMonths}
            setFlexibleMonths={setFlexibleMonths}
            adults={adults}
            setAdults={setAdults}
            childrenCount={childrenCount}
            setChildrenCount={setChildrenCount}
            infants={infants}
            setInfants={setInfants}
            pets={pets}
            setPets={setPets}
            formatGuestText={formatGuestText}
            formatWhenText={formatWhenText}
            setServiceType={setServiceType}
          />
        </div>
      )}

      {isExpanded && (
        <div
          onClick={() => {
            setIsExpanded(false);
            setOpenMenu(null);
          }}
          className="absolute left-0 top-full -z-10 h-[100vh] w-full bg-black/25 transition-opacity"
        />
      )}

      {showLanguageModal && (
        <LanguageCurrencyModal onClose={() => setShowLanguageModal(false)} />
      )}
    </header>
  );
}

function TopTab({ icon, label, path, badge, active = false }) {
  return (
    <Link
      to={path}
      className={`group relative flex items-center gap-2 transition-all duration-300 hover:scale-105 ${active ? "text-black" : "text-gray-500 hover:text-black"}`}
    >
      {badge && (
        <span className="absolute left-7 -top-4 z-10 rounded-full bg-[#2A3B4C] px-1.5 py-[2px] text-[9px] font-bold tracking-wider text-white shadow-sm">
          {badge}
        </span>
      )}
      <span className="text-[26px] leading-none transition-transform duration-300 group-hover:-translate-y-1">
        {icon}
      </span>
      <span className="text-sm font-medium text-gray-800">{label}</span>
      {active && (
        <span className="absolute -bottom-3 left-0 h-[2px] w-full rounded-full bg-black" />
      )}
    </Link>
  );
}

function SmallSearchBar({
  destination,
  when,
  guests,
  thirdMenuType = "guests",
  onMenuClick,
}) {
  const click = (e, menu) => {
    e.stopPropagation();
    onMenuClick(menu);
  };
  const stop = (e) => e.stopPropagation();
  const btnClass =
    "h-full max-w-40 truncate px-5 text-sm cursor-pointer font-medium text-gray-700 transition hover:bg-gray-100";
  const isDefaultThirdPill =
    guests === "Add guests" || guests === "Add service";

  return (
    <div
      onClick={(e) => click(e, "where")}
      className="flex h-12 cursor-pointer items-center overflow-hidden rounded-full border border-gray-300 bg-white shadow-md transition-all duration-500 hover:shadow-lg"
    >
      <button
        type="button"
        onClick={(e) => click(e, "where")}
        onMouseDown={stop}
        className={`${btnClass} rounded-l-full`}
      >
        {destination}
      </button>
      <div className="h-6 w-px bg-gray-300" />

      <button
        type="button"
        onClick={(e) => click(e, "when")}
        onMouseDown={stop}
        className={btnClass}
      >
        {when}
      </button>
      <div className="h-6 w-px bg-gray-300" />

      <button
        type="button"
        onClick={(e) => click(e, thirdMenuType)}
        onMouseDown={stop}
        className={`${btnClass} flex items-center !px-3 rounded-r-full`}
      >
        <span className="mr-2 max-w-30 truncate">{guests}</span>
      </button>

      <button className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E31C5F] text-white transition hover:bg-[#FF385C]">
        <Search size={16} />
      </button>
    </div>
  );
}
