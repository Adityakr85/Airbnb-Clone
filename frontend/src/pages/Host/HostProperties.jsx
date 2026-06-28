import { Link } from "react-router-dom";
import {
  Home,
  Star,
  Eye,
  IndianRupee,
  BedDouble,
  Bath,
  Users,
  MapPin,
} from "lucide-react";
import { useHost } from "./HostContext";

export default function HostProperties() {
  const { properties } = useHost();

  const activeCount = properties.filter((p) => p.status === "active").length;
  const totalViews = properties.reduce(
    (sum, p) => sum + Number(p.views || 0),
    0,
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold text-rose-500">Host listings</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Your Listings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your properties, pricing, availability and listing
            performance.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SummaryCard label="Total listings" value={properties.length} />
            <SummaryCard label="Active listings" value={activeCount} />
            <SummaryCard label="Total views" value={totalViews} />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {properties.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-16 text-center shadow-sm">
            <Home size={44} className="mx-auto mb-4 text-gray-300" />

            <h2 className="text-xl font-bold text-gray-900">No listings yet</h2>

            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              Once you publish your first property, it will appear here with
              performance details and controls.
            </p>

            <Link
              to="/host/add-property"
              className="mt-6 inline-flex rounded-full bg-[#FF385C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#E31C5F]"
            >
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {properties.map((p) => (
              <article
                key={p.id}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="grid gap-0 md:grid-cols-[260px_1fr]">
                  <img
                    src={p.image ? `${p.image}?w=420&q=80` : ""}
                    alt={p.title}
                    className="h-64 w-full bg-gray-100 object-cover md:h-full"
                  />

                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                p.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {p.status || "active"}
                            </span>

                            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                              {p.type || "Property"}
                            </span>
                          </div>

                          <h2 className="text-xl font-bold text-gray-900">
                            {p.title}
                          </h2>

                          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                            <MapPin size={14} />
                            {p.location}
                          </p>
                        </div>

                        <div className="text-left lg:text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{Number(p.price || 0).toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-gray-500">per night</p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 rounded-2xl bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Metric
                          icon={Star}
                          label="Rating"
                          value={p.rating || "New"}
                        />
                        <Metric icon={Eye} label="Views" value={p.views || 0} />
                        <Metric
                          icon={IndianRupee}
                          label="Earnings"
                          value={`₹${Number(p.earnings || 0).toLocaleString("en-IN")}`}
                        />
                        <Metric
                          icon={Users}
                          label="Bookings"
                          value={p.bookings || 0}
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1">
                          <Users size={14} />
                          {p.guests || 0} guests
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1">
                          <BedDouble size={14} />
                          {p.bedrooms || 0} bedrooms
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1">
                          <Bath size={14} />
                          {p.bathrooms || 0} bathrooms
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
                      <button className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                        Edit listing
                      </button>

                      <button className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500">
        <Icon size={15} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
