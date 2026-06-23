import { Link, Outlet, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import airbnbLogo from "../../assets/Airbnb-logo.png";

const navLinks = [
  { label: "Dashboard", to: "/host" },
  { label: "Reservations", to: "/host/reservations" },
  { label: "Listings", to: "/host/properties" },
  { label: "Analytics", to: "/host/analytics" },
];

export default function HostLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center">
            <img
              src={airbnbLogo}
              alt="Airbnb"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map(({ label, to }) => {
              const active =
                pathname === to || (to !== "/host" && pathname.startsWith(to));

              return (
                <Link
                  key={label}
                  to={to}
                  className={`px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : "rounded-full text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm font-semibold text-gray-700 underline transition hover:text-gray-900"
            >
              Switch to travelling
            </Link>

            <Link
              to="/host/add-property"
              className="flex items-center gap-1.5 rounded-full bg-[#FF385C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#E31C5F]"
            >
              <Plus size={14} />
              Add property
            </Link>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
