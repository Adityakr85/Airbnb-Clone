import LanguageCurrencyModal from "./LanguageCurrencyModal";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Heart,
  CalendarCheck,
  MessageSquare,
  User,
  Bell,
  Settings,
  Globe,
  CircleHelp,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";

export default function MenuDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useUser();
  const [showLanguageModal, setShowLanguageModal] = useState(false); // NEW

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const MenuItem = ({ icon: Icon, label, to }) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="flex w-full items-center gap-4 px-6 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-black transition"
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-[280px] max-h-[500px] overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-xl">
          <SignedOut>
            <button className="flex w-full items-center gap-3 px-6 py-4 hover:bg-gray-50 text-gray-600">
              <CircleHelp size={18} />
              <span>Help Centre</span>
            </button>

            <div className="mx-6 border-gray-300 border-t" />

            <button className="w-full px-6 py-4 text-left hover:bg-gray-50">
              <h3>Become a host</h3>
              <p className="text-sm text-gray-500">
                It’s easy to start hosting and earn extra income.
              </p>
            </button>

            <div className="mx-6 border-gray-300 border-t" />

            <button className="w-full px-6 py-4 text-left hover:bg-gray-50 text-gray-600">
              Refer a host
            </button>

            <button className="-mt-3 w-full px-6 py-4 text-left hover:bg-gray-50 text-gray-600">
              Find a co-host
            </button>

            <div className="mx-6 border-gray-300 border-t" />

            <SignInButton mode="modal">
              <button className="w-full px-6 py-4 text-left hover:bg-gray-50 ">
                Log in or sign up
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <MenuItem
              icon={Heart}
              label="Wishlists"
              to="/pages/User/Wishlist"
            />

            <MenuItem
              icon={CalendarCheck}
              label="Trips"
              to="/pages/User/Trips"
            />

            <MenuItem
              icon={MessageSquare}
              label="Messages"
              to="/pages/User/Messages"
            />

            <MenuItem
              icon={User}
              label="Profile"
              to="/pages/User/UserProfile/Profile"
            />

            <div className="mx-6 my-2 border-gray-300 border-t" />

            <MenuItem
              icon={Bell}
              label="Notifications"
              to="/pages/User/Notifications"
            />

            <MenuItem
              icon={Settings}
              label="Account Settings"
              to="/pages/User/AccountSettings"
            />

            {/* <MenuItem
              icon={Globe}
              label="Languages & Currency"
              to="/Language&Currency"
            /> */}

            <button
              onClick={() => {
                setShowLanguageModal(true);
                setOpen(false);
              }}
              className="flex w-full items-center gap-4 px-6 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-black transition"
            >
              <Globe size={18} />
              <span className="font-medium">Languages & Currency</span>
            </button>

            <MenuItem icon={CircleHelp} label="Help Centre" to="/HelpCentre" />
            <div className="mx-6 my-2 border-gray-300 border-t" />

            <button className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50">
              <div>
                <h3>Become a host</h3>
                <p className="text-sm text-gray-500">
                  It’s easy to start hosting and earn extra income.
                </p>
              </div>
              <span className="text-2xl">🧍‍♂️</span>
            </button>

            <button className="w-full px-6 py-3 text-left hover:bg-gray-50 text-gray-600">
              Refer a host
            </button>

            <button className="w-full px-6 py-3 text-left hover:bg-gray-50 text-gray-600">
              Find a co-host
            </button>

            <div className="mx-6 my-2 border-gray-300 border-t" />

            <SignOutButton>
              <button className="w-full px-6 py-4 text-left hover:bg-gray-50">
                Log out
              </button>
            </SignOutButton>
          </SignedIn>
        </div>
      )}

      {showLanguageModal && (
        <LanguageCurrencyModal onClose={() => setShowLanguageModal(false)} />
      )}
    </div>
  );
}
