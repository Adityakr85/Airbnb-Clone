import { Link } from "react-router-dom";
import {
  Home,
  CalendarCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Star,
  Eye,
  IndianRupee,
  Clock,
} from "lucide-react";
import { useHost } from "./HostContext";
import HostNavbar from "../../components/HostNavbar";

export default function HostDashboard() {
  const { properties, reservations, totalRevenue, totalBookings } = useHost();

  const pendingReservations = reservations.filter((r) => r.status === "pending");
  const confirmedReservations = reservations.filter((r) => r.status === "confirmed");

  const stats = [
    {
      label: "Total Properties",
      value: properties.length,
      icon: Home,
      color: "bg-rose-50 text-rose-500",
      link: "/host/properties",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: CalendarCheck,
      color: "bg-blue-50 text-blue-500",
      link: "/host/reservations",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green-50 text-green-500",
      link: "/host/analytics",
    },
    {
      label: "Pending Requests",
      value: pendingReservations.length,
      icon: Clock,
      color: "bg-amber-50 text-amber-500",
      link: "/host/reservations",
    },
  ];

  // const quickActions = [
  //   { label: "Add New Property", icon: Plus, to: "/host/add-property", color: "bg-rose-500 hover:bg-rose-600 text-white" },
  //   { label: "My Listings", icon: Home, to: "/host/properties", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
  //   { label: "View Analytics", icon: TrendingUp, to: "/host/analytics", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
  //   { label: "Reservations", icon: CalendarCheck, to: "/host/reservations", color: "bg-gray-100 hover:bg-gray-200 text-gray-800" },
  // ];

  return (
    <div className="min-h-screen bg-white">
      <HostNavbar />
      
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your listings.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, link }) => (
            <Link
              key={label}
              to={link}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </Link>
          ))}
        </div>

        
        {/* <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map(({ label, icon: Icon, to, color }) => (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition ${color}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        </div> */}

        <div className="grid md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Your Properties</h2>
              <Link to="/host/properties" className="text-rose-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {properties.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                  <img
                    src={`${p.image}?w=80&q=70`}
                    alt={p.title}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{p.title}</p>
                    <p className="text-sm text-gray-500 truncate">{p.location}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" /> {p.rating}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye size={12} /> {p.views} views
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">₹{p.price.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-gray-500">per night</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                Pending Requests
                {pendingReservations.length > 0 && (
                  <span className="ml-2 bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {pendingReservations.length}
                  </span>
                )}
              </h2>
              <Link to="/host/reservations" className="text-rose-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {pendingReservations.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400">
                <CalendarCheck size={32} className="mx-auto mb-2 opacity-30" />
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pendingReservations.map((r) => (
                  <div key={r.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center">
                            {r.guest.avatar}
                          </div>
                          <p className="font-medium text-gray-900">{r.guest.name}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{r.propertyTitle}</p>
                        <p className="text-xs text-gray-400">
                          {r.checkIn} → {r.checkOut} · {r.guests} guests
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{r.total.toLocaleString("en-IN")}</p>
                        <Link
                          to="/host/reservations"
                          className="text-xs text-rose-500 hover:underline mt-1 block"
                        >
                          Review →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        
        {confirmedReservations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Upcoming Stays</h2>
              <Link to="/host/reservations" className="text-rose-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {confirmedReservations.map((r) => (
                <div key={r.id} className="px-6 py-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center">
                      {r.guest.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{r.guest.name}</p>
                      <p className="text-xs text-gray-500">{r.propertyTitle}</p>
                    </div>
                    <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Confirmed</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>📅 {r.checkIn} → {r.checkOut}</span>
                    <span className="font-semibold text-gray-900">₹{r.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
