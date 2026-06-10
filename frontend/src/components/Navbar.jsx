import React, { useEffect, useState, useRef } from "react";
import { Search, Globe, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MenuDropdown from "./MenuDropdown";
import airbnbLogo from "../assets/Airbnb-logo.png";
import WhereDropdown from './WhereDropdown';
import WhenDropdown from './WhenDropdown'; 
import GuestDropdown from './GuestDropdown';

export default function Navbar({onSearch ,advanceToNext}) {
  const navigate = useNavigate();
  const [destinationSearch, setDestinationSearch] = useState("");
  // 1. ADDED: States to track dates in the Navbar!
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [exactDatesFlex, setExactDatesFlex] = useState('exact');
  // -- NEW: FLEXIBLE SEARCH STATES --
  const [activeTab, setActiveTab] = useState('dates'); 
  const [stayLength, setStayLength] = useState('week'); 
  const [flexibleMonths, setFlexibleMonths] = useState([]); 
  // -- GUEST STATES LIFTED UP --
  const [adults, setAdults] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  // -- UI STATES -
  const [scrolled, setScrolled] = useState(false);
  const [isWhereMenuOpen, setIsWhereMenuOpen] = useState(false);
  const [isWhenMenuOpen, setIsWhenMenuOpen] = useState(false);
  const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);

  const isAnyMenuOpen = isWhenMenuOpen || isWhereMenuOpen || isGuestMenuOpen;
  const formRef = useRef(null);
  // -- SMART GUEST FORMATTER --
  const formatGuestText = () => {
    const totalGuests = adults + childrenCount;
    if (totalGuests === 0 && infants === 0 && pets === 0) return "Add guests";

    let text = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`;
    if (infants > 0) text += `, ${infants} infant${infants !== 1 ? 's' : ''}`;
    if (pets > 0) text += `, ${pets} pet${pets !== 1 ? 's' : ''}`;
    return text;
  };
  // -- SMART FORMATTER --
  const formatWhenText = () => {
    // 1. If user is on the Flexible Tab:
    if (activeTab === 'flexible') {
      if (flexibleMonths.length === 0) {
        return `Any ${stayLength}`; 
      }
      const monthNames = flexibleMonths.map(id => {
        const [month, year] = id.split('-');
        return new Date(year, month).toLocaleDateString('en-US', { month: 'short' });
      });
      return `A ${stayLength} in ${monthNames.join(', ')}`; 
    } 
    // 2. If user is on the Dates Tab:
    else {
      if (!checkInDate) return "Add dates";
      
      const startStr = checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      let dateString = startStr; 
      if (checkOutDate) {
        const endStr = checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        if (checkInDate.getMonth() === checkOutDate.getMonth() && checkInDate.getFullYear() === checkOutDate.getFullYear()) {
          dateString = `${startStr} – ${checkOutDate.getDate()}`;
        } else {
          dateString = `${startStr} – ${endStr}`;
        }
      }
      if (exactDatesFlex !== 'exact') {
        const dayText = exactDatesFlex === '1' ? 'day' : 'days';
        return `${dateString} ± ${exactDatesFlex} ${dayText}`;
      }
      return dateString;
    }
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsWhenMenuOpen(false);
        setIsWhereMenuOpen(false);
        setIsGuestMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleSearch = (event) => {
    event.preventDefault();
    // Close all menus when searching
    setIsWhenMenuOpen(false);
    setIsWhereMenuOpen(false);
    setIsGuestMenuOpen(false);

    if (destinationSearch) {
      navigate(`/?search=${encodeURIComponent(destinationSearch)}`);
    } else {
      navigate(`/`);
    }
  };
  const isWhenActive = activeTab === 'flexible' || checkInDate;
  const isGuestActive = (adults + childrenCount + infants + pets) > 0;
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 transition-all duration-500 ease-in-out">
      <nav
        className={`relative flex items-center justify-between px-8 transition-all duration-500 ease-in-out ${
          scrolled ? "h-20" : "h-28"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center z-20">
         <img src={airbnbLogo} alt="Airbnb" className="h-10 w-auto object-contain" />
        </Link>

        {/* Center Area */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out">
          {scrolled ? (
            <div className="hidden md:flex h-12 items-center rounded-full border border-gray-300 bg-white shadow-md overflow-hidden transition-all duration-500 ease-in-out">
              <button className="px-5 flex items-center gap-2 text-sm font-semibold">
                🏠 Anywhere
              </button>

              <div className="h-6 w-px bg-gray-300" />

              <button className="px-5 text-sm font-semibold">Anytime</button>

              <div className="h-6 w-px bg-gray-300" />

              <button className={`px-5 text-sm truncate max-w-[150px] ${isGuestActive ? 'font-semibold text-black' : 'font-semibold text-gray-500'}`}>
                {formatGuestText()}
              </button>

              <button className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E31C5F] text-white hover:bg-[#FF385C] transition">
                <Search size={16} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-16 pt-4 transition-all duration-500 ease-in-out">
              {/* Homes */}
              <div className="group relative flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-105">
                <span className="text-3xl transition-transform duration-300 group-hover:-translate-y-1">
                  🏠
                </span>
                <span className="mt-1 font-semibold text-black">Homes</span>
                <div className="absolute -bottom-5 h-[3px] w-24 rounded-full bg-black" />
              </div>

              {/* Experiences */}
              <div className="group relative flex flex-col items-center cursor-pointer text-gray-500 hover:text-black transition-all duration-300 ease-in-out hover:scale-105">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-slate-600 px-2 py-[2px] text-[10px] font-bold text-white shadow">
                  NEW
                </span>

                <span className="text-3xl transition-transform duration-300 group-hover:-translate-y-1">
                  🎈
                </span>

                <span className="mt-1 font-semibold">Experiences</span>
              </div>

              {/* Services */}
              <div className="group relative flex flex-col items-center cursor-pointer text-gray-500 hover:text-black transition-all duration-300 ease-in-out hover:scale-105">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-slate-600 px-2 py-[2px] text-[10px] font-bold text-white shadow">
                  NEW
                </span>

                <span className="text-3xl transition-transform duration-300 group-hover:-translate-y-1">
                  🛎️
                </span>

                <span className="mt-1 font-semibold">Services</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 z-20">
          <button className="hidden md:block rounded-full px-4 py-3 font-semibold hover:bg-gray-100 transition">
            Become a host
          </button>

          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
            <Globe size={21} />
          </button>
          <MenuDropdown />
        </div>
      </nav>
      {/* Large Search Bar */}
      <div
        className={`hidden md:flex justify-center transition-all duration-500 ease-in-out ${
          scrolled ? "max-h-0 opacity-0 pb-0 overflow-hidden" : "max-h-28 opacity-100 pb-8 overflow-visible"
        }`}
      >
       <form 
          ref={formRef}
          onSubmit={handleSearch}
          className={`relative flex h-[58px] w-[75%] max-w-[800px] items-center rounded-full border border-gray-200 transition-all duration-300 ease-in-out ${
            isAnyMenuOpen ? "bg-gray-200" : "bg-white shadow-lg"
          }`}
        >
          {/* WhereDropdown SECTION */}
          <div 
            className={`flex-1 px-6 cursor-pointer h-full flex flex-col justify-center rounded-full transition-all duration-300 ${
              isWhereMenuOpen ? "bg-white shadow-md" : "hover:bg-gray-300"
            }`}
            onClick={() => {
              setIsWhereMenuOpen(true);
              setIsWhenMenuOpen(false);
              setIsGuestMenuOpen(false);
            }}
          >
            <h4 className="text-sm font-bold text-gray-900">Where</h4>
            <input
              type="text"
              placeholder="Search destinations"
              className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-500 outline-none truncate"
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
            />
          </div>
          {isWhereMenuOpen && (
            <WhereDropdown 
             destinationSearch={destinationSearch}
             setDestinationSearch={setDestinationSearch} 
             advanceToNext={() => {
              setIsWhereMenuOpen(false);
              setIsWhenMenuOpen(true);
             }}
            />
          )}
          <div className={`h-6 w-px bg-gray-300 transition-opacity ${isAnyMenuOpen ? "opacity-0" : "opacity-100"}`} />
          {/* WHENdropdown SECTION */}
          <div 
            className={`flex-1 px-6 cursor-pointer h-full flex flex-col justify-center rounded-full transition-all duration-300 ${
              isWhenMenuOpen ? "bg-white shadow-md" : "hover:bg-gray-300"
            }`}
            onClick={() => {
              setIsWhenMenuOpen(!isWhenMenuOpen);
              setIsWhereMenuOpen(false);
              setIsGuestMenuOpen(false);
            }}
          >
           <h4 className="text-sm font-bold text-gray-900">When</h4>
            <p className={`text-sm truncate ${isWhenActive ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              {formatWhenText()}
            </p>
          </div>
          {isWhenMenuOpen && (
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

          <div className={`h-6 w-px bg-gray-300 transition-opacity ${isAnyMenuOpen ? "opacity-0" : "opacity-100"}`} />

          {/* WHO SECTION */}
          <div 
            className={`flex-1 pl-6 pr-2 cursor-pointer h-full flex items-center justify-between rounded-full transition-all duration-300 ${
              isGuestMenuOpen ? "bg-white shadow-md" : "hover:bg-gray-300"
            }`}
            onClick={() => {
              setIsGuestMenuOpen(!isGuestMenuOpen);
              setIsWhereMenuOpen(false);
              setIsWhenMenuOpen(false);
            }}
          >
            <div className="flex flex-col justify-center h-full">
              <h4 className="text-sm font-bold text-gray-900">Who</h4>
              <p className={`text-sm truncate ${isGuestActive ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                {formatGuestText()}
              </p>
            </div>
            
            <button
              type="submit"
              className={`flex h-10 items-center justify-center rounded-full bg-[#E31C5F] text-white hover:bg-[#D70466] transition-all duration-300 ${
                isAnyMenuOpen ? "w-24 font-bold" : "w-10"
              }`}
            >
              <Search size={18} strokeWidth={3} className={isAnyMenuOpen ? "mr-2" : ""} />
              {isAnyMenuOpen && <span>Search</span>}
            </button>
          </div>
          {isGuestMenuOpen && (
            <GuestDropdown 
              adults={adults} setAdults={setAdults}
              childrenCount={childrenCount} setChildrenCount={setChildrenCount}
              infants={infants} setInfants={setInfants}
              pets={pets} setPets={setPets}
            />
          )}
        </form>
      </div>
    </header>
  );
}
