import React, { useState } from "react";
import { Search, Globe, Menu } from "lucide-react";
import { Link, useNavigate , useLocation} from "react-router-dom";
import toast from "react-hot-toast";
import {SignedIn, SignedOut,SignInButton,SignOutButton,useUser,} from "@clerk/clerk-react";

export default function HelpCenterNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { user, isSignedIn } = useUser();
  const isHomePage = location.pathname === "/help";
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/help/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
 
  return (
    <>
      {!isHomePage && <div className="h-20 w-full shrink-0" />}
      <header 
        className={`${
          isHomePage
            ? "relative bg-white border-none" 
            : "fixed left-0 top-0 bg-white border-b border-gray-200 shadow-xs"
        } z-50 flex h-20 w-full items-center justify-between px-6 md:px-10 lg:px-20 transition-all text-[#222222]`}
      >
        {/* --- LOGO (Safely pointed to Home '/') --- */}
        <Link to="/help" className="flex items-center gap-3 group">
          <img 
            src="/Stayfinder-1.png" 
            alt="Stay Finder Icon" 
            className="h-8 w-8 object-contain brightness-0 opacity-90" 
          />
          <span className="text-[20px] font-medium tracking-tight text-[#222222]-900">Help Centre</span>
        </Link>

        {isHomePage ? (
           <div className="flex-1" />
        ) : (
          <form onSubmit={handleSearch} className="hidden flex-1 items-center justify-center px-5 md:flex">
            <div className="relative flex w-full max-w-[300px] items-center justify-between rounded-full border border-gray-300 bg-white py-2 pl-5 pr-2 shadow-sm transition hover:shadow-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search how-tos and more"
                className="w-full bg-transparent text-[16px] font-medium text-gray-900 outline-none placeholder:text-gray-800"
             />
              <button type="submit" className="flex h-9 w-11 items-center justify-center rounded-full bg-[#FF385C] text-white hover:bg-[#e22b4c] transition active:scale-95 cursor-pointer">
                <Search size={18} strokeWidth={3} />
              </button>
            </div>
          </form>
        )}

        <div className="relative flex items-center gap-2">
          {/* Globe Trigger */}
          <button 
            onClick={() => toast("🌐 Region & Currency settings")}
            className="cursor-pointer hidden items-center justify-center rounded-full h-10 w-10 text-gray-900 hover:bg-gray-100 transition md:flex"
          >
            <Globe size={18} strokeWidth={2} />
          </button>

          {/* User Profile Pill */}
          <div 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex cursor-pointer items-center gap-3 rounded-full border border-gray-300 p-1 pl-2 transition hover:shadow-md select-none"
          >
            <Menu size={18} className="text-gray-800" />
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-100 transition hover:bg-gray-200 cursor-pointer">
              {isSignedIn ? (
                (<img src={user?.imageUrl} alt="Profile" className="h-full w-full object-cover rounded-full"/>)
              ) : (
                <div className="h-full w-full text-[#717171]">
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
                    <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
                  </svg>
                </div>
              )}
            </div>
          </div>

         {/* --- FLOATING PROFILE DROPDOWN MENU --- */}
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 top-14 w-[240px] z-50 rounded-2xl border border-gray-200 bg-white py-2.5 shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-150">
                {isSignedIn ? (
                  <>
                    <Link to="/help/all-topics" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-[14px] font-normal hover:bg-[#f7f7f7] transition cursor-pointer ">
                      All topics
                    </Link>
                    <Link to="/host" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-[14px] font-normal hover:bg-[#f7f7f7] transition">
                      Hosting Resources
                    </Link>
                    <div className="my-2 border-t border-gray-200" />
                    <Link to="/pages/User/UserProfile/Profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
                      Account
                    </Link>
                    <SignOutButton signOutCallback={() => setIsMenuOpen(false)}>
                      <button className="w-full text-left block px-4 py-2.5 text-[14px] hover:bg-[#f7f7f7] cursor-pointer">
                        Log out
                      </button>
                    </SignOutButton>
                    <div className="my-2 border-t border-gray-200" />
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2.5 text-sm font-semibold text-[#FF385C] hover:bg-gray-100">
                      Exit Help Centre
                    </Link>
                  </>
                 ) : (
                  <>
                    <Link  to="/help/all-topics"  onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-[14px] font-normal hover:bg-[#f7f7f7] transition">
                      All topics
                    </Link>
                    <Link 
                     to="/host" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-[14px] font-normal hover:bg-[#f7f7f7] transition"
                    >
                      Hosting Resources
                    </Link>
                    <div className="my-2 border-t border-gray-200" />
                    <SignInButton mode="modal">
                      <button 
                        onClick={() => setIsMenuOpen(false)} 
                        className="w-full text-left block px-4 py-2.5 text-[15px] font-normal text-[#222222] hover:bg-[#f7f7f7] transition cursor-pointer"
                      >
                        Log in
                      </button>
                    </SignInButton>

                    <SignInButton mode="modal">
                      <button 
                        onClick={() => setIsMenuOpen(false)} 
                        className="w-full text-left block px-4 py-2.5 text-[15px] font-normal text-[#222222] hover:bg-[#f7f7f7] transition cursor-pointer"
                      >
                        Sign up
                      </button>
                    </SignInButton>
                    <div className="my-2 border-t border-gray-200" />
                    <Link 
                      to="/" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-[#FF385C] hover:bg-gray-100"
                    >
                      Exit Help Centre
                    </Link>
                 </>
                )}
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}