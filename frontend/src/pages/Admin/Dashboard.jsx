import {
  Users,
  Home,
  Compass,
  CalendarCheck,
  IndianRupee,
  Clock,
  Plus,
  Bell,
  TicketPercent,
  Activity,
  Database,
  Server,
  HardDrive,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 58000 },
  { month: "Mar", revenue: 64000 },
  { month: "Apr", revenue: 72000 },
  { month: "May", revenue: 91000 },
  { month: "Jun", revenue: 125000 },
];

const stats = [
  { title: "Total Users", value: "1,248", change: "+12%", icon: Users },
  { title: "Properties", value: "324", change: "+8%", icon: Home },
  { title: "Experiences", value: "156", change: "+6%", icon: Compass },
  { title: "Bookings", value: "876", change: "+18%", icon: CalendarCheck },
  { title: "Revenue", value: "₹8.4L", change: "+21%", icon: IndianRupee },
  {
    title: "Pending Approvals",
    value: "42",
    change: "Needs review",
    icon: Clock,
  },
];

const quickActions = [
  { title: "Add Property", icon: Plus },
  { title: "Add Experience", icon: Compass },
  { title: "Send Notification", icon: Bell },
  { title: "Create Coupon", icon: TicketPercent },
];

const bookings = [
  ["Rahul Sharma", "Luxury Villa in Goa", "₹12,500", "Confirmed"],
  ["Sneha Verma", "Mumbai Apartment", "₹8,200", "Pending"],
  ["Amit Kumar", "Manali Mountain Stay", "₹10,000", "Confirmed"],
];

const activities = [
  "New host registered",
  "Property approved by admin",
  "User submitted a review",
  "Coupon SUMMER25 created",
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase text-white/80">
          Admin Overview
        </p>
        <h1 className="mt-2 text-4xl font-bold">Welcome back, Admin 👋</h1>
        <p className="mt-3 max-w-2xl text-white/90">
          Manage users, listings, bookings, payments, approvals, and platform
          activity from one professional dashboard.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[1.7rem] bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-xl font-bold">Monthly Revenue</h2>
          <p className="text-sm text-gray-500">
            Revenue growth over the last 6 months
          </p>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#e11d48"
                  fill="#ffe4e6"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[1.7rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <div className="mt-5 grid gap-3">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 font-semibold transition hover:bg-gray-50"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={19} className="text-rose-500" />
                    {item.title}
                  </span>
                  <ArrowUpRight size={18} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[1.7rem] bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-xl font-bold">Recent Bookings</h2>

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-gray-100">
                {bookings.map((item) => (
                  <tr key={item[0]} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold">{item[0]}</td>
                    <td className="px-5 py-4 text-gray-500">{item[1]}</td>
                    <td className="px-5 py-4 font-bold">{item[2]}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                        {item[3]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[1.7rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Recent Activity</h2>

          <div className="mt-5 space-y-4">
            {activities.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <Activity size={18} />
                </div>
                <p className="text-sm font-medium text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <HealthCard title="API Status" value="Operational" icon={Server} />
        <HealthCard title="Database" value="Connected" icon={Database} />
        <HealthCard title="Storage Usage" value="64%" icon={HardDrive} />
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
          <p className="mt-3 text-sm font-semibold text-emerald-600">
            {change}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function HealthCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Icon size={23} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-lg font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
}
