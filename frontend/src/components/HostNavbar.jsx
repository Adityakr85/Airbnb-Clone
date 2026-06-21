import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import airbnbLogo from "../assets/Airbnb-logo.png";

const navLinks = [
  { label: "Dashboard", to: "/host" },
  { label: "Reservations", to: "/host/reservations" },
  { label: "Listings", to: "/host/properties" },
  { label: "Analytics", to: "/host/analytics" },
];

export default function HostNavbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">

        <Link to="/" className="flex items-center">
          <img src={airbnbLogo} alt="Airbnb" className="h-8 w-auto object-contain" />
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map(({ label, to }) => {
            const active = pathname === to || (to !== "/host" && pathname.startsWith(to));
            return (
              <Link key={label} to={to}
                className={`px-4 py-2 text-sm font-semibold transition ${
                  active ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full"
                }`}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-gray-900 underline transition">
            Switch to travelling
          </Link>
          <Link to="/host/add-property"
            className="flex items-center gap-1.5 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-4 py-2 rounded-full text-sm font-semibold transition">
            <Plus size={14} /> Add property
          </Link>
        </div>
      </div>
    </header>
  );
}
