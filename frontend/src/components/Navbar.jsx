import { useEffect, useState } from "react";
import { Search, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import MenuDropdown from "./MenuDropdown";
import airbnbLogo from "../assets/Airbnb-logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const hideSearchBar =
    location.pathname.startsWith("/pages/User/Messages") ||
    location.pathname.startsWith("/pages/User/Notifications") ||
    location.pathname.startsWith("/pages/User/AccountSettings") ||
    location.pathname.startsWith("/pages/User/Profile") ||
    location.pathname.startsWith("/pages/User/EditProfile");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 70);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 transition-all duration-500 ease-in-out">
      <nav
        className={`relative flex items-center justify-between px-8 transition-all duration-500 ease-in-out ${
          scrolled || hideSearchBar ? "h-20" : "h-28"
        }`}
      >
        <Link to="/" className="flex items-center z-20">
          <img
            src={airbnbLogo}
            alt="Airbnb"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {!hideSearchBar && (
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out md:block">
            {scrolled ? (
              <div className="flex h-12 items-center overflow-hidden rounded-full border border-gray-300 bg-white shadow-md transition-all duration-500 ease-in-out">
                <button className="flex items-center gap-2 px-5 text-sm font-semibold">
                  🏠 Anywhere
                </button>

                <div className="h-6 w-px bg-gray-300" />

                <button className="px-5 text-sm font-semibold">Anytime</button>

                <div className="h-6 w-px bg-gray-300" />

                <button className="px-5 text-sm font-semibold">
                  Add guests
                </button>

                <button className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E31C5F] text-white hover:bg-[#FF385C] transition">
                  <Search size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-16 pt-4 transition-all duration-500 ease-in-out">
                <div className="group relative flex cursor-pointer flex-col items-center transition-all duration-300 ease-in-out hover:scale-105">
                  <span className="text-3xl transition-transform duration-300 group-hover:-translate-y-1">
                    🏠
                  </span>
                  <span className="mt-1 font-semibold text-black">Homes</span>
                  <div className="absolute -bottom-5 h-[3px] w-24 rounded-full bg-black" />
                </div>

                <div className="group relative flex cursor-pointer flex-col items-center text-gray-500 transition-all duration-300 ease-in-out hover:scale-105 hover:text-black">
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-slate-600 px-2 py-[2px] text-[10px] font-bold text-white shadow">
                    NEW
                  </span>
                  <span className="text-3xl transition-transform duration-300 group-hover:-translate-y-1">
                    🎈
                  </span>
                  <span className="mt-1 font-semibold">Experiences</span>
                </div>

                <div className="group relative flex cursor-pointer flex-col items-center text-gray-500 transition-all duration-300 ease-in-out hover:scale-105 hover:text-black">
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
        )}

        <div className="flex items-center gap-4 z-20">
          <button className="hidden rounded-full px-4 py-3 font-semibold transition hover:bg-gray-100 md:block">
            Become a host
          </button>

          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
            <Globe size={21} />
          </button>

          <MenuDropdown />
        </div>
      </nav>

      {!hideSearchBar && (
        <div
          className={`hidden justify-center overflow-hidden transition-all duration-500 ease-in-out md:flex ${
            scrolled ? "max-h-0 opacity-0 pb-0" : "max-h-28 opacity-100 pb-8"
          }`}
        >
          <div className="flex h-[66px] w-[78%] max-w-[950px] items-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-lg transition-all duration-500 ease-in-out">
            <div className="flex-1 px-8">
              <h4 className="text-sm font-semibold">Where</h4>
              <p className="text-gray-500">Search destinations</p>
            </div>

            <div className="flex h-full flex-1 flex-col justify-center rounded-full bg-gray-100 px-8">
              <h4 className="text-sm font-semibold">When</h4>
              <p className="text-gray-500">Add dates</p>
            </div>

            <div className="flex-1 px-8">
              <h4 className="text-sm font-semibold">Who</h4>
              <p className="text-gray-500">Add guests</p>
            </div>

            <button className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E31C5F] text-white transition hover:bg-[#FF385C]">
              <Search size={26} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
