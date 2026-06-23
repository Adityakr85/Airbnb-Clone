import React, { useState } from "react";
import { Search, Globe, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function HelpCenterNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 1. Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Trigger your existing Hot-Toaster to prove the data was captured!
    toast.success(`Searching Help Center for: "${searchQuery}"`, {
      position: "top-center",
      style: { borderRadius: '999px', background: '#222', color: '#fff' }
    });

    // (Future step: navigate(`/help/search?q=${searchQuery}`))
  };

  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-gray-200 bg-white px-6 md:px-10 lg:px-20">
      
      {/* --- LOGO (Safely pointed to Home '/') --- */}
      <Link to="/" className="flex items-center gap-2">
        <svg
          viewBox="0 0 1000 1000"
          className="h-8 w-8 fill-[#FF385C]"
        >
          <path d="m499.3 736.7c-51-64-81-120.1-91-168.1-10-39-6-70 11-93 18-27 45-40 80-40s62 13 80 40c17 23 21 54 11 93-11 49-41 105-91 168.1zm362.2 43c-7 47-39 86-83 105-85 37-169.1-22-241.1-102 119.1-149.1 141.1-265.1 90-340.2-30-43-73-64-128.1-64-111 0-172.1 94-148.1 203.1 14 59 51 126.1 110 201.1-37 41-72 70-103 88-24 13-47 21-69 23-101 15-180.1-83-144.1-184.1 5-13 15-37 32-74l1-2c55-120.1 122.1-256.1 199.1-407.2l2-5 22-42c17-31 24-45 51-62 13-8 29-12 47-12 36 0 64 21 76 38 6 9 13 21 22 36l21 41 3 6c77 151.1 144.1 287.1 199.1 407.2l1 1 20 46 12 29c9.2 23.1 11.2 46.1 8.2 70.1zm46-90.1c-7-22-19-48-34-79v-1c-71-151.1-137.1-287.1-200.1-409.2l-4-6c-45-92-77-147.1-170.1-147.1-92 0-131.1 64-171.1 147.1l-3 6c-63 122.1-129.1 258.1-200.1 409.2v2l-21 46c-16 36-30 74-31 115-1 47 16 90 46 122 32 34 76 53 124.1 53 105 0 188.1-70 252.1-137 66 65 149.1 137 253.1 137 47 0 91-19 123.1-51 31-31 51-73 52-120 0-38-16-79-37-122l-1-2z"></path>
        </svg>
        <span className="text-[22px] font-semibold tracking-tight text-gray-900">
          Help Centre
        </span>
      </Link>

      {/* --- INTERACTIVE SEARCH PILL --- */}
      <form 
        onSubmit={handleSearch}
        className="hidden flex-1 items-center justify-center px-8 md:flex"
      >
        <div className="relative flex w-full max-w-[600px] items-center justify-between rounded-full border border-gray-300 bg-white py-2 pl-6 pr-2 shadow-sm transition hover:shadow-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search how-tos and more"
            className="w-full bg-transparent text-[15px] font-medium text-gray-900 outline-none placeholder:text-gray-500"
          />
          <button 
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF385C] text-white hover:bg-[#e22b4c] transition active:scale-95"
          >
            <Search size={18} strokeWidth={3} />
          </button>
        </div>
      </form>

      {/* --- RIGHT SIDE CONTROLS --- */}
      <div className="relative flex items-center gap-2">
        
        {/* Globe Trigger */}
        <button 
          onClick={() => toast("🌐 Region & Currency settings")}
          className="hidden items-center justify-center rounded-full h-10 w-10 text-gray-900 hover:bg-gray-100 transition md:flex"
        >
          <Globe size={18} />
        </button>

        {/* User Profile Pill */}
        <div 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex cursor-pointer items-center gap-3 rounded-full border border-gray-300 p-2 pl-3 transition hover:shadow-md select-none"
        >
          <Menu size={18} className="text-gray-900" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
            A
          </div>
        </div>

        {/* --- FLOATING PROFILE DROPDOWN MENU --- */}
        {isMenuOpen && (
          <div className="absolute right-0 top-14 w-60 rounded-2xl border border-gray-200 bg-white py-3 shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-150">
            
            {/* Wired directly to the real routes in your App.jsx! */}
            <Link 
              to="/pages/User/Messages" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Messages
            </Link>
            <Link 
              to="/pages/User/Notifications" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Notifications
            </Link>
            <Link 
              to="/pages/User/Trips" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Trips
            </Link>
            <Link 
              to="/pages/User/Wishlist" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Wishlist
            </Link>

            <div className="my-2 border-t border-gray-200" />

            <Link 
              to="/host" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              Manage your listings
            </Link>
            <Link 
              to="/pages/User/UserProfile/Profile" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              Account
            </Link>
            
            <div className="my-2 border-t border-gray-200" />
            
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-5 py-2.5 text-sm font-semibold text-[#FF385C] hover:bg-gray-100"
            >
              Exit Help Centre
            </Link>
          </div>
        )}

      </div>
    </header>
  );
}