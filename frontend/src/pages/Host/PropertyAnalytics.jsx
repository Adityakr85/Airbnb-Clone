import {
  TrendingUp,
  Eye,
  CalendarCheck,
  IndianRupee,
  Star,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useHost } from "./HostContext";

const monthlyData = [
  { month: "Jan", views: 45, bookings: 3, earnings: 12600 },
  { month: "Feb", views: 62, bookings: 4, earnings: 16800 },
  { month: "Mar", views: 78, bookings: 5, earnings: 21000 },
  { month: "Apr", views: 95, bookings: 6, earnings: 25200 },
  { month: "May", views: 112, bookings: 8, earnings: 33600 },
  { month: "Jun", views: 130, bookings: 7, earnings: 29400 },
];

export default function PropertyAnalytics() {
  const { properties, totalRevenue, totalBookings } = useHost();

  const totalViews = properties.reduce((s, p) => s + Number(p.views || 0), 0);

  const ratedProps = properties.filter((p) => Number(p.rating || 0) > 0);
  const avgRating =
    ratedProps.length > 0
      ? (
          ratedProps.reduce((s, p) => s + Number(p.rating || 0), 0) /
          ratedProps.length
        ).toFixed(1)
      : "N/A";

  const summaryCards = [
    {
      label: "Total Views",
      value: totalViews,
      icon: Eye,
      color: "bg-blue-50 text-blue-500",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: CalendarCheck,
      color: "bg-violet-50 text-violet-500",
    },
    {
      label: "Total Revenue",
      value: `₹${Number(totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green-50 text-green-500",
    },
    {
      label: "Avg Rating",
      value: avgRating,
      icon: Star,
      color: "bg-yellow-50 text-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold text-rose-500">
            Host performance
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review revenue, bookings, views and conversion across your listings.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
              >
                <Icon size={21} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Revenue Overview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Monthly earnings trend for the last 6 months.
              </p>
            </div>

            <div className="flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-600">
              <TrendingUp size={15} />
              +18% vs last period
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient
                    id="earningsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#FF385C" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#FF385C" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Earnings",
                  ]}
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #eee",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#FF385C"
                  strokeWidth={3}
                  fill="url(#earningsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <MiniAreaCard
            title="Listing Views"
            subtitle="Monthly page visits"
            dataKey="views"
            gradientId="viewsGradient"
            stroke="#3B82F6"
            formatter={(value) => [`${value} views`, "Views"]}
          />

          <MiniAreaCard
            title="Bookings"
            subtitle="Confirmed reservations"
            dataKey="bookings"
            gradientId="bookingsGradient"
            stroke="#8B5CF6"
            formatter={(value) => [`${value} bookings`, "Bookings"]}
          />
        </div>

        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-bold text-gray-900">Property Breakdown</h2>
            <p className="mt-1 text-sm text-gray-500">
              Compare performance across individual listings.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-500">
                  <th className="px-6 py-3 text-left font-semibold">
                    Property
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">Views</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-right font-semibold">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-right font-semibold">Rating</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {properties.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      No property analytics available yet.
                    </td>
                  </tr>
                ) : (
                  properties.map((p) => {
                    const views = Number(p.views || 0);
                    const bookings = Number(p.bookings || 0);
                    const convRate =
                      views > 0 ? ((bookings / views) * 100).toFixed(1) : "0.0";

                    return (
                      <tr key={p.id} className="transition hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image ? `${p.image}?w=48&q=60` : ""}
                              alt=""
                              className="h-10 w-10 rounded-lg bg-gray-100 object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {p.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {p.location}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-right text-gray-700">
                          {views}
                        </td>

                        <td className="px-4 py-4 text-right text-gray-700">
                          {bookings}
                          <span className="ml-1 text-xs text-gray-400">
                            ({convRate}%)
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                          ₹{Number(p.earnings || 0).toLocaleString("en-IN")}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {Number(p.rating || 0) > 0 ? (
                            <span className="flex items-center justify-end gap-1 font-medium text-gray-700">
                              <Star
                                size={13}
                                className="fill-yellow-400 text-yellow-400"
                              />
                              {p.rating}
                            </span>
                          ) : (
                            <span className="text-gray-400">New</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {properties.length > 0 && (
                <tfoot>
                  <tr className="border-t border-gray-200 bg-gray-50 font-semibold">
                    <td className="px-6 py-3 text-gray-700">Total</td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {totalViews}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {totalBookings}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-900">
                      ₹{Number(totalRevenue || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-700">
                      {avgRating}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function MiniAreaCard({
  title,
  subtitle,
  dataKey,
  gradientId,
  stroke,
  formatter,
}) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stroke} stopOpacity={0.3} />
                <stop offset="95%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              formatter={formatter}
              contentStyle={{
                borderRadius: "14px",
                border: "1px solid #eee",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
