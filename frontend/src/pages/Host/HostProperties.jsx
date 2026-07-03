import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Star,
  Eye,
  IndianRupee,
  BedDouble,
  Bath,
  Users,
  MapPin,
  Trash2,
} from "lucide-react";
import { useHost } from "./HostContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function getImageUrl(value) {
  if (!value) return "/placeholder.jpg";

  if (typeof value === "object") {
    value = value.url || value.image_path || "";
  }

  if (typeof value !== "string" || !value.trim()) return "/placeholder.jpg";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/storage/")) {
    return `${API_BASE}${value}`;
  }

  if (value.startsWith("storage/")) {
    return `${API_BASE}/${value}`;
  }

  return `${API_BASE}/storage/${value}`;
}

function getPropertyImage(property) {
  return getImageUrl(
    property?.image || property?.image_urls?.[0] || property?.images?.[0],
  );
}

function getPropertyCategory(property) {
  return property?.category?.name || property?.category_name || "Property";
}

export default function HostProperties() {
  const { properties, deleteProperty } = useHost();
  const navigate = useNavigate();

  const [deletingId, setDeletingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  const activeCount = properties.filter((p) => p.status === "active").length;
  const totalViews = properties.reduce(
    (sum, p) => sum + Number(p.views || 0),
    0,
  );

  const handleDelete = async (id) => {
    setShowConfirm(id);
  };

  const confirmDelete = async (id) => {
    setDeletingId(id);
    setShowConfirm(null);
    await deleteProperty(id);
    setDeletingId(null);
  };

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
                onClick={() => navigate(`/property/${p.id}`)}
                className="cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="grid md:grid-cols-[300px_1fr]">
                  <div className="h-64 w-full overflow-hidden bg-gray-100 md:h-full">
                    <img
                      src={getPropertyImage(p)}
                      alt={p.title || "Property"}
                      className="h-full w-full object-cover object-center transition duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg";
                      }}
                    />
                  </div>

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
                              {p.display_status || p.status || "active"}
                            </span>

                            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                              {getPropertyCategory(p)}
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

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4"
                    >
                      <button
                        onClick={() => navigate(`/host/edit-property/${p.id}`)}
                        className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Edit Listing
                      </button>

                      {showConfirm === p.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => confirmDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            {deletingId === p.id ? "Deleting..." : "Confirm"}
                          </button>

                          <button
                            onClick={() => setShowConfirm(null)}
                            className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="flex items-center gap-1 rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
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
