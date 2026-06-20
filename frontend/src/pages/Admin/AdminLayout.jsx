import {
  LayoutDashboard,
  Users,
  Home,
  CalendarCheck,
  Star,
  Bell,
  Settings,
  LogOut,
  Menu,
  Grid3X3,
  Compass,
  CreditCard,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Properties", path: "/admin/properties", icon: Home },
  { name: "Experiences", path: "/admin/experiences", icon: Compass },
  { name: "Reservations", path: "/admin/reservations", icon: CalendarCheck },
  { name: "Reviews", path: "/admin/reviews", icon: Star },
  { name: "Categories", path: "/admin/categories", icon: Grid3X3 },
  { name: "Payments", path: "/admin/payments", icon: CreditCard },
  { name: "Notifications", path: "/admin/notifications", icon: Bell },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#f7f7f7] text-gray-900">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-gray-200 bg-white px-5 py-6 lg:flex">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">AirAdmin</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your platform</p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                  }`
                }
              >
                <Icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <button className="mt-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-950">
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className="min-h-screen flex-1 lg:ml-72">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 lg:hidden">
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <p className="text-sm text-gray-500">Welcome back, admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
            </button>

            <div className="flex items-center gap-3 rounded-full bg-gray-100 px-3 py-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-600" />
              <div className="hidden sm:block">
                <p className="text-sm font-bold">Admin</p>
                <p className="text-xs text-gray-500">Super admin</p>
              </div>
            </div>
          </div>
        </header>

        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
