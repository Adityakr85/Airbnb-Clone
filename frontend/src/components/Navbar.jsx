import { useEffect, useState } from "react";
import { Search, Globe, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import MenuDropdown from "./MenuDropdown";
import SearchBar from "./Search/SearchBar";
import airbnbLogo from "../assets/Airbnb-logo.png";

const TABS = [
  { path: "/", icon: "🏠", label: "Homes" },
  { path: "/Experiences", icon: "🎈", label: "Experiences", badge: "NEW" },
  { path: "/Services", icon: "🛎️", label: "Services", badge: "NEW" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMenu, setOpenMenu] = useState("where");
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

  // OPTIMIZATION: 1-line Regex instead of 5 startsWith() checks
  const hideSearchBar =
    /^\/pages\/User\/(Messages|Notifications|AccountSettings|UserProfile)/.test(
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

  // OPTIMIZATION: Push text to an array and join, avoiding ugly string concatenation
  const formatGuestText = () => {
    const total = adults + childrenCount;
    if (!total && !infants && !pets) return "Add guests";

    const parts = [`${total} guest${total !== 1 ? "s" : ""}`];
    if (infants) parts.push(`${infants} infant${infants !== 1 ? "s" : ""}`);
    if (pets) parts.push(`${pets} pet${pets !== 1 ? "s" : ""}`);

    return parts.join(", ");
  };

  // OPTIMIZATION: Consolidated logic and reused date formatter
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
        className={`relative flex items-center justify-between px-8 transition-all duration-500 ease-in-out ${(scrolled && !isExpanded) || hideSearchBar ? "h-20" : "h-28"}`}
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
                guests={formatGuestText()}
                onMenuClick={(menu) => {
                  setIsExpanded(true);
                  setOpenMenu(menu);
                }}
              />
            ) : (
              <div className="flex items-center gap-16 pt-4 transition-all duration-500">
                {TABS.map((tab) => (
                  <TopTab
                    key={tab.path}
                    {...tab}
                    active={location.pathname === tab.path}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="z-20 flex items-center gap-4">
          <Link
            to="/become-a-host"
            className="hidden rounded-full px-4 py-3 font-semibold transition hover:bg-gray-100 md:block"
          >
            Become a host
          </Link>

          {isSignedIn ? (
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
          ) : (
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
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
    </header>
  );
}

function TopTab({ path, icon, label, badge, active = false }) {
  return (
    <Link
      to={path}
      className={`group relative flex flex-col items-center transition-all duration-300 hover:scale-105 ${
        active ? "text-black" : "text-gray-500 hover:text-black"
      }`}
    >
      {badge && (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-slate-600 px-2 py-0.5 text-xs font-bold text-white shadow">
          {badge}
        </span>
      )}

      <span className="text-3xl transition-transform duration-300 group-hover:-translate-y-1">
        {icon}
      </span>

      <span className="mt-1 font-semibold">{label}</span>

      {active && (
        <span className="absolute -bottom-2 h-1 w-18 rounded-full bg-black" />
      )}
    </Link>
  );
}

function SmallSearchBar({ destination, when, guests, onMenuClick }) {
  // OPTIMIZATION: Variables strictly avoid typing out the same wrappers & functions 4 times
  const click = (e, menu) => {
    e.stopPropagation();
    onMenuClick(menu);
  };
  const stop = (e) => e.stopPropagation();
  const btnClass =
    "h-full max-w-40 truncate px-5 text-sm font-semibold transition hover:bg-gray-100";

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
        onClick={(e) => click(e, "guests")}
        onMouseDown={stop}
        className={`${btnClass} flex items-center rounded-r-full text-gray-500`}
      >
        <span className="mr-3 max-w-40 truncate">{guests}</span>
      </button>

      <button className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E31C5F] text-white transition hover:bg-[#FF385C]">
        <Search size={16} />
      </button>
    </div>
  );
}
