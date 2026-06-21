import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { canAccess } from "../../config/AdminAccess";
import Alerts from "./Alerts";
import Profile from "./Profile";

import {
  LayoutDashboard,
  Users,
  Home,
  Compass,
  Grid3X3,
  CalendarCheck,
  CreditCard,
  Star,
  Flag,
  MessageCircle,
  BarChart3,
  TicketPercent,
  Sparkles,
  FileText,
  Settings,
  Activity,
  Server,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
} from "lucide-react";

const groups = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
        permission: "dashboard",
        end: true,
      },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Users", path: "/admin/users", icon: Users, permission: "users" },
      {
        name: "Properties",
        path: "/admin/properties",
        icon: Home,
        permission: "properties",
      },
      {
        name: "Experiences",
        path: "/admin/experiences",
        icon: Compass,
        permission: "experiences",
      },
      {
        name: "Categories",
        path: "/admin/categories",
        icon: Grid3X3,
        permission: "categories",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        name: "Reservations",
        path: "/admin/reservations",
        icon: CalendarCheck,
        permission: "reservations",
      },
      {
        name: "Payments",
        path: "/admin/payments",
        icon: CreditCard,
        permission: "payments",
      },
    ],
  },
  {
    title: "Moderation",
    items: [
      {
        name: "Reviews",
        path: "/admin/reviews",
        icon: Star,
        permission: "reviews",
      },
      {
        name: "Reports",
        path: "/admin/reports",
        icon: Flag,
        permission: "reports",
      },
      {
        name: "Support",
        path: "/admin/support",
        icon: MessageCircle,
        permission: "support",
      },
      {
        name: "Notifications",
        path: "/admin/notifications",
        icon: Bell,
        permission: "notifications",
      },
    ],
  },
  {
    title: "Growth",
    items: [
      {
        name: "Marketing",
        path: "/admin/marketing",
        icon: TicketPercent,
        permission: "marketing",
      },
      {
        name: "Featured Listings",
        path: "/admin/featured-listings",
        icon: Sparkles,
        permission: "featured-listings",
      },
      { name: "CMS", path: "/admin/cms", icon: FileText, permission: "cms" },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        name: "Analytics",
        path: "/admin/analytics",
        icon: BarChart3,
        permission: "analytics",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        name: "Activity Logs",
        path: "/admin/activity-logs",
        icon: Activity,
        permission: "activity-logs",
      },
      {
        name: "Monitoring",
        path: "/admin/monitoring",
        icon: Server,
        permission: "monitoring",
      },
      {
        name: "Settings",
        path: "/admin/settings",
        icon: Settings,
        permission: "settings",
      },
    ],
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const role = user?.publicMetadata?.role || "Guest";

  const [openGroups, setOpenGroups] = useState({
    Overview: true,
    Management: true,
    Operations: true,
    Moderation: false,
    Growth: false,
    Analytics: false,
    System: false,
  });

  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccess(role, item.permission)),
    }))
    .filter((group) => group.items.length > 0);

  const isGroupActive = (group) =>
    group.items.some((item) =>
      item.end
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path),
    );

  const toggleGroup = (title) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const [openNotifications, setOpenNotifications] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f6f7fb] text-gray-950">
      <aside className="fixed left-0 top-0 hidden h-screen w-[19rem] flex-col border-r border-gray-200 bg-white/95 px-4 py-5 shadow-sm backdrop-blur-xl lg:flex">
        <div className="mb-6 rounded-[1.5rem] bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 p-5 text-white shadow-lg shadow-rose-100">
          <h1 className="text-2xl font-black tracking-tight">AirAdmin</h1>
          <p className="mt-1 text-sm text-white/80">
            Professional control center
          </p>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto pr-1">
          {visibleGroups.map((group) => {
            const activeGroup = isGroupActive(group);
            const opened = openGroups[group.title];

            return (
              <div
                key={group.title}
                className={`rounded-[1.4rem] transition-all duration-300 ${
                  activeGroup
                    ? "bg-rose-50/80 ring-1 ring-rose-100"
                    : "bg-transparent"
                }`}
              >
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={`flex w-full items-center justify-between rounded-[1.4rem] px-4 py-3 text-xs font-black uppercase tracking-wide transition-all duration-300 ${
                    activeGroup
                      ? "text-rose-600"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        activeGroup ? "bg-rose-500" : "bg-gray-300"
                      }`}
                    />
                    {group.title}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      opened ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    opened
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-1 px-2 pb-3">
                      {group.items.map((item) => {
                        const Icon = item.icon;

                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                              `group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                                isActive
                                  ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
                                  : "text-gray-600 hover:translate-x-1 hover:bg-white hover:text-gray-950 hover:shadow-sm"
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                {isActive && (
                                  <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                                )}

                                <Icon
                                  size={19}
                                  className={`transition-transform duration-300 ${
                                    isActive
                                      ? "scale-110"
                                      : "group-hover:scale-110"
                                  }`}
                                />

                                <span>{item.name}</span>
                              </>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {visibleGroups.length === 0 && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
              No admin permissions found. Check Clerk role metadata.
            </div>
          )}
        </nav>

        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="mt-5 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-gray-950"
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="min-h-screen flex-1 lg:ml-[19rem]">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 lg:hidden">
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <p className="text-sm text-gray-500">Access level: {role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Alerts />
            <Profile />
          </div>
        </header>

        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
