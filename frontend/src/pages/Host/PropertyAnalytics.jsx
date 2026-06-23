import { Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  Eye,
  CalendarCheck,
  IndianRupee,
  Star,
} from "lucide-react";
import { useHost } from "./HostContext";
const monthlyData = [
  { month: "Jan", views: 45, bookings: 3, earnings: 12600 },
  { month: "Feb", views: 62, bookings: 4, earnings: 16800 },
  { month: "Mar", views: 78, bookings: 5, earnings: 21000 },
  { month: "Apr", views: 95, bookings: 6, earnings: 25200 },
  { month: "May", views: 112, bookings: 8, earnings: 33600 },
  { month: "Jun", views: 130, bookings: 7, earnings: 29400 },
];

function SimpleBar({ value, max, color = "bg-rose-400" }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="w-full flex flex-col justify-end" style={{ height: 80 }}>
        <div
          className={`w-full rounded-t-lg ${color} transition-all duration-700`}
          style={{ height: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function PropertyAnalytics() {
  const { properties, totalRevenue, totalBookings } = useHost();

  const totalViews = properties.reduce((s, p) => s + p.views, 0);
  const avgRating =
    properties.filter((p) => p.rating > 0).length > 0
      ? (
          properties
            .filter((p) => p.rating > 0)
            .reduce((s, p) => s + p.rating, 0) /
          properties.filter((p) => p.rating > 0).length
        ).toFixed(1)
      : "N/A";

  const maxEarnings = Math.max(...monthlyData.map((d) => d.earnings));
  const maxViews = Math.max(...monthlyData.map((d) => d.views));
  const maxBookings = Math.max(...monthlyData.map((d) => d.bookings));

  const summaryCards = [
    {
      label: "Total Views",
      value: totalViews,
      icon: Eye,
      color: "text-blue-500 bg-blue-50",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: CalendarCheck,
      color: "text-violet-500 bg-violet-50",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-green-500 bg-green-50",
    },
    {
      label: "Avg Rating",
      value: avgRating,
      icon: Star,
      color: "text-yellow-500 bg-yellow-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm">
            Performance overview for all your listings
          </p>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3`}
                >
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Monthly Earnings
                </h2>
                <p className="text-sm text-gray-500">Last 6 months</p>
              </div>
              <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp size={14} /> +18% vs last period
              </div>
            </div>
            <div className="flex items-end gap-2 h-24">
              {monthlyData.map((d) => (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full flex flex-col justify-end"
                    style={{ height: 80 }}
                  >
                    <div
                      className="w-full rounded-t-lg bg-rose-400 hover:bg-rose-500 transition-all cursor-pointer"
                      style={{
                        height: `${Math.round((d.earnings / maxEarnings) * 100)}%`,
                      }}
                      title={`₹${d.earnings.toLocaleString("en-IN")}`}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
              <span>₹0</span>
              <span>₹{maxEarnings.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-1">
                Monthly Views
              </h2>
              <p className="text-sm text-gray-500 mb-5">Listing page visits</p>
              <div className="flex items-end gap-2 h-20">
                {monthlyData.map((d) => (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full flex flex-col justify-end"
                      style={{ height: 64 }}
                    >
                      <div
                        className="w-full rounded-t-lg bg-blue-400 hover:bg-blue-500 transition-all"
                        style={{
                          height: `${Math.round((d.views / maxViews) * 100)}%`,
                        }}
                        title={`${d.views} views`}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-1">
                Monthly Bookings
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                Confirmed reservations
              </p>
              <div className="flex items-end gap-2 h-20">
                {monthlyData.map((d) => (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full flex flex-col justify-end"
                      style={{ height: 64 }}
                    >
                      <div
                        className="w-full rounded-t-lg bg-violet-400 hover:bg-violet-500 transition-all"
                        style={{
                          height: `${Math.round((d.bookings / maxBookings) * 100)}%`,
                        }}
                        title={`${d.bookings} bookings`}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                Property Breakdown
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-100">
                    <th className="text-left px-6 py-3 font-medium">
                      Property
                    </th>
                    <th className="text-right px-4 py-3 font-medium">Views</th>
                    <th className="text-right px-4 py-3 font-medium">
                      Bookings
                    </th>
                    <th className="text-right px-6 py-3 font-medium">
                      Earnings
                    </th>
                    <th className="text-right px-6 py-3 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {properties.map((p) => {
                    const convRate =
                      p.views > 0
                        ? ((p.bookings / p.views) * 100).toFixed(1)
                        : "0.0";
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={`${p.image}?w=48&q=60`}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {p.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {p.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right text-gray-700">
                          {p.views}
                        </td>
                        <td className="px-4 py-4 text-right text-gray-700">
                          {p.bookings}
                          <span className="text-xs text-gray-400 ml-1">
                            ({convRate}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                          ₹{p.earnings.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {p.rating > 0 ? (
                            <span className="flex items-center justify-end gap-1">
                              <Star
                                size={13}
                                className="text-yellow-400 fill-yellow-400"
                              />
                              {p.rating}
                            </span>
                          ) : (
                            <span className="text-gray-400">New</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-200 font-semibold">
                    <td className="px-6 py-3 text-gray-700">Total</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {totalViews}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {totalBookings}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-900">
                      ₹{totalRevenue.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-700">
                      {avgRating}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
