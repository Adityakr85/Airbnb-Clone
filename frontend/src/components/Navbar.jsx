import { Search, Globe, Menu } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm">
      <nav className="h-[92px] flex items-center justify-between px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 text-[#FF385C] font-bold text-3xl">
          <span className="text-4xl">⌂</span>
          <span>airbnb</span>
        </div>

        {/* Center Tabs */}
        <div className="hidden md:flex items-center gap-10">
          <div className="relative flex flex-col items-center cursor-pointer">
            <span className="text-3xl">🏠</span>
            <span className="font-semibold text-black">Homes</span>
            <div className="absolute -bottom-4 w-28 h-[3px] bg-black rounded-full"></div>
          </div>

          <div className="relative flex flex-col items-center cursor-pointer text-gray-600">
            <span className="absolute -top-3 right-0 text-[10px] bg-slate-600 text-white px-2 py-[2px] rounded-full">
              NEW
            </span>
            <span className="text-3xl">🎈</span>
            <span className="font-semibold">Experiences</span>
          </div>

          <div className="relative flex flex-col items-center cursor-pointer text-gray-600">
            <span className="absolute -top-3 right-0 text-[10px] bg-slate-600 text-white px-2 py-[2px] rounded-full">
              NEW
            </span>
            <span className="text-3xl">🛎️</span>
            <span className="font-semibold">Services</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block font-semibold hover:bg-gray-100 px-4 py-3 rounded-full">
            Become a host
          </button>

          <button className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <Globe size={21} />
          </button>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <Menu size={22} />
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="flex justify-center pb-10">
        <div className="w-[78%] max-w-[950px] h-[66px] bg-white border border-gray-200 rounded-full shadow-lg flex items-center overflow-hidden">
          <div className="flex-1 px-8">
            <h4 className="font-semibold text-sm">Where</h4>
            <p className="text-gray-500">Search destinations</p>
          </div>

          <div className="flex-1 h-full bg-gray-100 rounded-full px-8 flex flex-col justify-center">
            <h4 className="font-semibold text-sm">When</h4>
            <p className="text-gray-500">Add dates</p>
          </div>

          <div className="flex-1 px-8">
            <h4 className="font-semibold text-sm">Who</h4>
            <p className="text-gray-500">Add guests</p>
          </div>

          <button className="mr-4 w-14 h-14 rounded-full bg-[#E31C5F] text-white flex items-center justify-center hover:bg-[#FF385C] transition">
            <Search size={26} />
          </button>
        </div>
      </div>
    </header>
  );
}
