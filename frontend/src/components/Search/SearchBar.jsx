import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import WhereDropdown from "./WhereDropdown";
import WhenDropdown from "./WhenDropdown";
import GuestDropdown from "./GuestDropdown";

export default function SearchBar({
  destinationSearch,
  setDestinationSearch,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  exactDatesFlex,
  setExactDatesFlex,
  activeTab,
  setActiveTab,
  stayLength,
  setStayLength,
  flexibleMonths,
  setFlexibleMonths,
  adults,
  setAdults,
  childrenCount,
  setChildrenCount,
  infants,
  setInfants,
  pets,
  setPets,
  formatGuestText,
  formatWhenText,
}) {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);

  const isAnyMenuOpen = openMenu !== null;
  const isWhenActive = activeTab === "flexible" || checkInDate;
  const isGuestActive = adults + childrenCount + infants + pets > 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setOpenMenu(null);

    if (destinationSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(destinationSearch.trim())}`);
    } else {
      navigate("/");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSearch}
      className={`relative flex h-14 w-3/4 max-w-4xl items-center rounded-full border border-gray-200 transition-all duration-300 ${
        isAnyMenuOpen ? "bg-gray-200" : "bg-white shadow-lg"
      }`}
    >
      <div
        onClick={() => setOpenMenu("where")}
        className={`flex h-full flex-1 cursor-pointer flex-col justify-center rounded-full px-6 transition-all duration-300 ${
          openMenu === "where" ? "bg-white shadow-md" : "hover:bg-gray-300"
        }`}
      >
        <h4 className="text-sm font-bold text-gray-900">Where</h4>

        <input
          type="text"
          placeholder="Search destinations"
          value={destinationSearch}
          onChange={(event) => setDestinationSearch(event.target.value)}
          className="w-full truncate bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
        />

        {openMenu === "where" && (
          <WhereDropdown
            destinationSearch={destinationSearch}
            setDestinationSearch={setDestinationSearch}
            advanceToNext={() => setOpenMenu("when")}
          />
        )}
      </div>

      <Divider hidden={isAnyMenuOpen} />

      <div
        onClick={() => setOpenMenu("when")}
        className={`flex h-full flex-1 cursor-pointer flex-col justify-center rounded-full px-6 transition-all duration-300 ${
          openMenu === "when" ? "bg-white shadow-md" : "hover:bg-gray-300"
        }`}
      >
        <h4 className="text-sm font-bold text-gray-900">When</h4>

        <p
          className={`truncate text-sm ${
            isWhenActive ? "font-semibold text-gray-900" : "text-gray-500"
          }`}
        >
          {checkInDate ? formatWhenText() : "Add dates"}
        </p>

        {openMenu === "when" && (
          <WhenDropdown
            startDate={checkInDate}
            setStartDate={setCheckInDate}
            endDate={checkOutDate}
            setEndDate={setCheckOutDate}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stayLength={stayLength}
            setStayLength={setStayLength}
            flexibleMonths={flexibleMonths}
            setFlexibleMonths={setFlexibleMonths}
            exactDatesFlex={exactDatesFlex}
            setExactDatesFlex={setExactDatesFlex}
          />
        )}
      </div>

      <Divider hidden={isAnyMenuOpen} />

      <div
        onClick={() => setOpenMenu("guests")}
        className={`flex h-full flex-1 cursor-pointer items-center justify-between rounded-full pl-6 pr-2 transition-all duration-300 ${
          openMenu === "guests" ? "bg-white shadow-md" : "hover:bg-gray-300"
        }`}
      >
        <div className="flex h-full flex-col justify-center">
          <h4 className="text-sm font-bold text-gray-900">Who</h4>

          <p
            className={`max-w-36 truncate text-sm ${
              isGuestActive ? "font-semibold text-gray-900" : "text-gray-500"
            }`}
          >
            {formatGuestText()}
          </p>
        </div>

        {openMenu === "guests" && (
          <GuestDropdown
            adults={adults}
            setAdults={setAdults}
            childrenCount={childrenCount}
            setChildrenCount={setChildrenCount}
            infants={infants}
            setInfants={setInfants}
            pets={pets}
            setPets={setPets}
          />
        )}
      </div>

      <button
        type="submit"
        className={`mr-2 flex h-10 items-center justify-center rounded-full bg-[#E31C5F] text-white transition-all duration-300 hover:bg-[#D70466] ${
          isAnyMenuOpen ? "w-24 font-bold" : "w-10"
        }`}
      >
        <Search
          size={18}
          strokeWidth={3}
          className={isAnyMenuOpen ? "mr-2" : ""}
        />

        {isAnyMenuOpen && <span>Search</span>}
      </button>
    </form>
  );
}

function Divider({ hidden }) {
  return (
    <div
      className={`h-6 w-px bg-gray-300 transition-opacity ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    />
  );
}
