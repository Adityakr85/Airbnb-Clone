import React,{ useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate ,useLocation , useSearchParams } from "react-router-dom";

import WhereDropdown from "./WhereDropdown";
import WhenDropdown from "./WhenDropdown";
import GuestDropdown from "./GuestDropdown";
import ServiceDropdown from "./ServiceDropdown";

export default function SearchBar({onSearch,
  destinationSearch,setDestinationSearch,
  checkInDate,setCheckInDate,checkOutDate,setCheckOutDate,exactDatesFlex,setExactDatesFlex,  // -- EXACT DATES STATES --
  activeTab,setActiveTab,stayLength,setStayLength,flexibleMonths,setFlexibleMonths,  // -- FLEXIBLE SEARCH STATES --
  adults,setAdults,childrenCount,setChildrenCount,infants,setInfants,pets,setPets,   // -- GUEST STATES
  formatGuestText, formatWhenText, openMenu, setOpenMenu ,setIsExpanded,
  serviceType ,setServiceType
}) 
{
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isServicesPage = location.pathname.includes("/services");
  const formRef = useRef(null);

  const isAnyMenuOpen = openMenu !== null;
  const isWhenActive = checkInDate !== null || flexibleMonths.length > 0;
  const isGuestActive = adults + childrenCount + infants + pets > 0;

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlType = searchParams.get("type");

    if (urlSearch && urlSearch !== "nearby") {
      setDestinationSearch(urlSearch);
    } else if (!urlSearch) {
      setDestinationSearch("");
    }
    if (isServicesPage) {
      if (urlType) {
        if (setServiceType) setServiceType(urlType);
      } else if (!urlType) {
        if (setServiceType) setServiceType("");
      }
    }
  }, [searchParams, isServicesPage, setDestinationSearch, setServiceType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setOpenMenu(null);
        if (typeof setIsExpanded === 'function') {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsExpanded]);

   const handleSearch = (event) => {
     event.preventDefault();
     setOpenMenu(null);
     
     if (typeof setIsExpanded === 'function') {
       setIsExpanded(false);
     }
     setTimeout(() => {
       let basePath = '/';
       if (location.pathname.includes('/experiences')) basePath = '/experiences';
       if (location.pathname.includes('/services')) basePath = '/services';

       const finalSearch = destinationSearch.trim() ? destinationSearch.trim() : "nearby";

       if (!destinationSearch.trim()) {
         setDestinationSearch("nearby");
       }
       let searchUrl = `${basePath}?search=${encodeURIComponent(finalSearch)}`;
       
       // Add check-in and check-out dates to search URL if they exist
       if (checkInDate) {
         searchUrl += `&checkIn=${encodeURIComponent(checkInDate.toISOString().split('T')[0])}`;
       }
       if (checkOutDate) {
         searchUrl += `&checkOut=${encodeURIComponent(checkOutDate.toISOString().split('T')[0])}`;
       }
       
       if (basePath === '/services' && serviceType) {
         searchUrl += `&type=${encodeURIComponent(serviceType)}`;
       }
       navigate(searchUrl);
     }, 300);
   };

  const advanceToNext = () => {
  if (openMenu === "where") {
    setOpenMenu("when");
  } else if (openMenu === "when") {
    setOpenMenu("guests");
  } else {
    setOpenMenu(null);
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
        onClick={() => setOpenMenu(openMenu === "where" ? null : "where")}
        className={`relative flex h-full flex-1 cursor-pointer flex-col justify-center rounded-full px-6 transition-all duration-300 ${
          openMenu === "where" ? "bg-white shadow-md" : "hover:bg-gray-300"
        }`}
      >
        <h4 className="text-sm font-bold text-gray-900">Where</h4>

        <input
          type="text"
          placeholder="Search destinations"
          value={destinationSearch}
          onChange={(event) => setDestinationSearch(event.target.value)}
          className="w-full truncate bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 pr-6"
        />

        {destinationSearch && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDestinationSearch("");
            }}
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-1 text-gray-600 transition hover:bg-gray-300"
          >
            <X size={14} strokeWidth={3} />
          </button>
        )}

        {openMenu === "where" && (
          <WhereDropdown
            destinationSearch={destinationSearch}
            setDestinationSearch={setDestinationSearch}
            advanceToNext={advanceToNext}
          />
        )}
      </div>

      <Divider hidden={isAnyMenuOpen} />

      <div
        onClick={() => setOpenMenu(openMenu === "when" ? null : "when")}
        className={`relative flex h-full flex-1 cursor-pointer flex-col justify-center rounded-full px-6 transition-all duration-300 ${
          openMenu === "when" ? "bg-white shadow-md" : "hover:bg-gray-300"
        }`}
      >
        <h4 className="text-sm font-bold text-gray-900">When</h4>
        <p className={`truncate text-sm pr-6 ${isWhenActive ? "font-semibold text-gray-900" : "text-gray-500"}`}>
          {isWhenActive ? formatWhenText() : "Add dates"}
        </p>

        {isWhenActive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCheckInDate(null);
              setCheckOutDate(null);
              setFlexibleMonths([]); 
            }}
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-1 text-gray-600 transition hover:bg-gray-300"
          >
            <X size={14} strokeWidth={3}/>
          </button>
        )}

        {openMenu === "when" && (
          <WhenDropdown
            startDate={checkInDate} setStartDate={setCheckInDate} endDate={checkOutDate} setEndDate={setCheckOutDate}
            activeTab={activeTab} setActiveTab={setActiveTab} stayLength={stayLength} setStayLength={setStayLength}
            flexibleMonths={flexibleMonths} setFlexibleMonths={setFlexibleMonths} exactDatesFlex={exactDatesFlex} setExactDatesFlex={setExactDatesFlex}
            advanceToNext={advanceToNext}
          />
        )}
      </div>

      <Divider hidden={isAnyMenuOpen}/>
      {isServicesPage ? (
        <div
          onClick={() => setOpenMenu(openMenu === "service" ? null : "service")}
          className={`relative flex h-full flex-1 cursor-pointer items-center justify-between rounded-full pl-6 pr-2 transition-all duration-300 ${
            openMenu === "service" ? "bg-white shadow-md" : "hover:bg-gray-300"
          }`}
        >
          <div className="flex h-full flex-col justify-center">
            <h4 className="text-sm font-bold text-gray-900">Type of service</h4>
            <p className={`max-w-36 truncate text-sm pr-6 ${serviceType ? "font-semibold text-gray-900" : "text-gray-500"}`}>
              {serviceType || "Add service"}
            </p>
          </div>

          {serviceType && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (setServiceType) setServiceType("");
              }}
              className="cursor-pointer absolute right-16 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-1 text-gray-600 transition hover:bg-gray-300"
            >
              <X size={14} strokeWidth={3} />
            </button>
          )}

          {openMenu === "service" && (
            <ServiceDropdown 
              serviceType={serviceType} 
              setServiceType={setServiceType} 
              advanceToNext={() => setOpenMenu(null)} 
            />
          )}
        </div>
      ) : (
      <div
        onClick={() => setOpenMenu(openMenu === "guests" ? null : "guests")}
        className={`relative flex h-full flex-1 cursor-pointer items-center justify-between rounded-full pl-6 pr-2 transition-all duration-300 ${
          openMenu === "guests" ? "bg-white shadow-md" : "hover:bg-gray-300"
        }`}
      >
        <div className="flex h-full flex-col justify-center">
          <h4 className="text-sm font-bold text-gray-900">Who</h4>
          <p className={`max-w-36 truncate text-sm pr-6 ${isGuestActive ? "font-semibold text-gray-900" : "text-gray-500"}`}>
            {formatGuestText()}
          </p>
        </div>

        {isGuestActive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setAdults(0);
              setChildrenCount(0);
              setInfants(0);
              setPets(0);
            }}
            className="cursor-pointer absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-1 text-gray-600 transition hover:bg-gray-300"
          >
            <X size={14} strokeWidth={3} />
          </button>
        )}

        {openMenu === "guests" && (
          <GuestDropdown
             adults={adults} setAdults={setAdults} childrenCount={childrenCount} setChildrenCount={setChildrenCount}
             infants={infants} setInfants={setInfants} pets={pets} setPets={setPets}
          />
        )}
      </div>
     )}

      <button
        type="submit"
        className={`cursor-pointer mr-2 flex h-10 items-center justify-center rounded-full bg-[#E31C5F] text-white transition-all duration-300 hover:bg-[#D70466] ${
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
