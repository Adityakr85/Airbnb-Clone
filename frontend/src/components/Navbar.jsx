import { useEffect, useState } from "react";
import { Search, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import MenuDropdown from "./MenuDropdown";
import SearchBar from "./Search/SearchBar";
import airbnbLogo from "../assets/Airbnb-logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
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

  const hideSearchBar =
    location.pathname.startsWith("/pages/User/Messages") ||
    location.pathname.startsWith("/pages/User/Notifications") ||
    location.pathname.startsWith("/pages/User/AccountSettings") ||
    location.pathname.startsWith("/pages/User/UserProfile/Profile") ||
    location.pathname.startsWith("/pages/User/UserProfile/EditProfile");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 70);

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatGuestText = () => {
    const totalGuests = adults + childrenCount;

    if (totalGuests === 0 && infants === 0 && pets === 0) {
      return "Add guests";
    }

    let text = `${totalGuests} guest${totalGuests !== 1 ? "s" : ""}`;

    if (infants > 0) {
      text += `, ${infants} infant${infants !== 1 ? "s" : ""}`;
    }

    if (pets > 0) {
      text += `, ${pets} pet${pets !== 1 ? "s" : ""}`;
    }

    return text;
  };

  const formatWhenText = () => {
    if (activeTab === "flexible") {
      if (flexibleMonths.length === 0) return `Any ${stayLength}`;

      const months = flexibleMonths.map((id) => {
        const [month, year] = id.split("-");
        return new Date(year, month).toLocaleDateString("en-US", {
          month: "short",
        });
      });

      return `A ${stayLength} in ${months.join(", ")}`;
    }

    if (!checkInDate) return "Anytime";

    const startText = checkInDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!checkOutDate) return startText;

    const endText = checkOutDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    let dateText =
      checkInDate.getMonth() === checkOutDate.getMonth() &&
      checkInDate.getFullYear() === checkOutDate.getFullYear()
        ? `${startText} – ${checkOutDate.getDate()}`
        : `${startText} – ${endText}`;

    if (exactDatesFlex !== "exact") {
      dateText += ` ± ${exactDatesFlex} ${
        exactDatesFlex === "1" ? "day" : "days"
      }`;
    }

    return dateText;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <nav
        className={`relative flex items-center justify-between px-8 transition-all duration-500 ease-in-out ${
          scrolled || hideSearchBar ? "h-20" : "h-28"
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
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            {scrolled ? (
              <SmallSearchBar
                destination={destinationSearch || "Anywhere"}
                when={formatWhenText()}
                guests={formatGuestText()}
              />
            ) : (
              <div className="flex items-center gap-16 pt-4 transition-all duration-500">
                <TopTab icon="🏠" label="Homes" active />
                <TopTab icon="🎈" label="Experiences" badge="NEW" />
                <TopTab icon="🛎️" label="Services" badge="NEW" />
              </div>
            )}
          </div>
        )}

        <div className="z-20 flex items-center gap-4">
          <Link
            to="/host"
            className="hidden rounded-full px-4 py-3 font-semibold transition hover:bg-gray-100 md:block"
          >
            Become a host
          </Link>

          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
            <Globe size={21} />
          </button>

          <MenuDropdown />
        </div>
      </nav>

      {!hideSearchBar && (
        <div
          className={`hidden justify-center transition-all duration-500 ease-in-out md:flex ${
            scrolled
              ? "max-h-0 overflow-hidden pb-0 opacity-0"
              : "max-h-28 overflow-visible pb-8 opacity-100"
          }`}
        >
          <SearchBar
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
    </header>
  );
}

function TopTab({ icon, label, badge, active = false }) {
  return (
    <button
      type="button"
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
        <span className="absolute -bottom-5 h-1 w-24 rounded-full bg-black" />
      )}
    </button>
  );
}

function SmallSearchBar({ destination, when, guests }) {
  return (
    <div className="flex h-12 items-center overflow-hidden rounded-full border border-gray-300 bg-white shadow-md transition-all duration-500">
      <button className="max-w-40 truncate px-5 text-sm font-semibold">
        {destination}
      </button>

      <div className="h-6 w-px bg-gray-300" />

      <button className="max-w-40 truncate px-5 text-sm font-semibold">
        {when}
      </button>

      <div className="h-6 w-px bg-gray-300" />

      <button className="max-w-40 truncate px-5 text-sm font-semibold text-gray-500">
        {guests}
      </button>

      <button className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E31C5F] text-white transition hover:bg-[#FF385C]">
        <Search size={16} />
      </button>
    </div>
  );
}
