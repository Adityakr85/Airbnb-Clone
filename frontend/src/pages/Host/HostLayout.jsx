import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import stayfinderLogo from "../../assets/Stayfinder-Logo.png";

const navLinks = [
  { label: "Dashboard", to: "/host" },
  { label: "Reservations", to: "/host/reservations" },
  { label: "Listings", to: "/host/properties" },
  { label: "Analytics", to: "/host/analytics" },
  { label: "Messages", to: "/host/messages" },
];

const wizardRoutes = ["/become-a-host", "/host/add-property"];

export default function HostLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isWizardPage = wizardRoutes.includes(pathname);
  const isAddPropertyPage = pathname === "/host/add-property";

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 h-20 border-b border-gray-200 bg-white">
        <div className="flex h-full w-full items-center justify-between px-8">
          <Link to="/" className="flex items-center">
            <img
              src={stayfinderLogo}
              alt="Stayfinder"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {!isWizardPage && (
            <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
              {navLinks.map(({ label, to }) => {
                const active =
                  pathname === to ||
                  (to !== "/host" && pathname.startsWith(to));

                return (
                  <Link
                    key={label}
                    to={to}
                    className={`px-4 py-3 text-sm font-semibold transition ${
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
          )}

          <div className="ml-auto flex items-center gap-4">
            {isWizardPage ? (
              <>
                <button className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:bg-gray-50">
                  Questions?
                </button>

                <button
                  onClick={() => navigate(isAddPropertyPage ? "/host" : "/")}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
                >
                  {isAddPropertyPage ? "Save & exit" : "Exit"}
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
