import { useMemo, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Search,
  Download,
  Home,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Star,
  MoreVertical,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  fetchAdminProperties,
  approveProperty,
  rejectProperty,
} from "../../api/admin";

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

export default function Properties() {
  const { user, isLoaded } = useUser();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = async () => {
    try {
      if (!isLoaded) return;

      const clerkId = user?.id;
      const role = user?.publicMetadata?.role;

      if (!clerkId) {
        setProperties([]);
        setError("Unable to load properties: User not authenticated");
        return;
      }

      const data = await fetchAdminProperties(clerkId, role);
      setProperties(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to load properties:", err);
      setError("Failed to load properties. Please try again later.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      const clerkId = user?.id;
      const role = user?.publicMetadata?.role;

      await approveProperty(clerkId, propertyId, role);

      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? { ...p, status: "Approved", moderation_status: "approved" }
            : p,
        ),
      );

      setSelectedProperty(null);
    } catch (err) {
      console.error("Failed to approve property:", err);
      alert("Failed to approve property. Please try again.");
    }
  };

  const handleReject = async (propertyId) => {
    try {
      const clerkId = user?.id;
      const role = user?.publicMetadata?.role;

      await rejectProperty(clerkId, propertyId, role);

      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? { ...p, status: "Rejected", moderation_status: "rejected" }
            : p,
        ),
      );

      setSelectedProperty(null);
    } catch (err) {
      console.error("Failed to reject property:", err);
      alert("Failed to reject property. Please try again.");
    }
  };

  useEffect(() => {
    fetchProperties();

    const intervalId = setInterval(fetchProperties, 5000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]);

  const stats = useMemo(() => {
    return {
      total: properties.length,
      approved: properties.filter((p) => p.status === "Approved").length,
      pending: properties.filter((p) => p.status === "Pending").length,
      rejected: properties.filter((p) => p.status === "Rejected").length,
    };
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const categoryName =
        property.category?.name || property.category_name || "";

      const matchesSearch =
        property.title?.toLowerCase().includes(search.toLowerCase()) ||
        property.host?.toLowerCase().includes(search.toLowerCase()) ||
        property.location?.toLowerCase().includes(search.toLowerCase()) ||
        categoryName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || property.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [properties, search, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Properties</h1>
          <p className="mt-1 text-gray-500">
            Manage property listings, approval status, hosts, and visibility.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export Properties
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          title="Total Properties"
          value={stats.total}
          icon={Home}
          active={status === "All"}
          onClick={() => setStatus("All")}
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          active={status === "Approved"}
          onClick={() => setStatus("Approved")}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          active={status === "Pending"}
          onClick={() => setStatus("Pending")}
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          active={status === "Rejected"}
          onClick={() => setStatus("Rejected")}
        />
      </div>

      <div className="rounded-[1.7rem] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by title, host, location, or category..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-500">
          <Loader2 className="animate-spin" size={30} />
        </div>
      ) : error ? (
        <div className="rounded-[1.7rem] border border-red-100 bg-red-50 p-8 text-center">
          <p className="font-bold text-red-600">{error}</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="rounded-[1.7rem] border border-gray-100 bg-white p-10 text-center shadow-sm">
          <p className="font-bold text-gray-900">No properties found</p>
          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onManage={() => setSelectedProperty(property)}
            />
          ))}
        </div>
      )}

      {selectedProperty && (
        <PropertyDrawer
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

function PropertyCard({ property, onManage }) {
  const categoryName =
    property.category?.name || property.category_name || "Property";

  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56">
        <img
          src={getPropertyImage(property)}
          alt={property.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />

        <Badge status={property.status} />

        <button
          onClick={onManage}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 transition hover:bg-white"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="p-5">
        <h2 className="truncate text-lg font-black">{property.title}</h2>

        <p className="mt-1 text-sm text-gray-500">
          Hosted by {property.host || "Unknown"}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} />
          {property.location}
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <span>{categoryName}</span>

          <span className="flex items-center gap-1">
            <Star size={16} className="text-rose-500" fill="currentColor" />
            {property.rating || 0}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-xl font-black">{property.price}</p>
            <p className="text-xs text-gray-500">per night</p>
          </div>

          <button
            onClick={onManage}
            className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold transition hover:bg-gray-200"
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}

function PropertyDrawer({ property, onClose, onApprove, onReject }) {
  const categoryName =
    property.category?.name || property.category_name || "Property";

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Property Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <img
          src={getPropertyImage(property)}
          alt={property.title}
          className="mt-6 h-64 w-full rounded-[1.5rem] object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />

        <div className="mt-6">
          <div className="inline-flex">
            <Badge status={property.status} inline />
          </div>

          <h3 className="mt-4 text-2xl font-black">{property.title}</h3>

          <p className="mt-1 text-gray-500">
            Hosted by {property.host || "Unknown"}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="Location" value={property.location} />
          <Info title="Category" value={categoryName} />
          <Info title="Price" value={property.price} />
          <Info title="Rating" value={property.rating || 0} />
          <Info title="Bookings" value={property.bookings || 0} />
          <Info title="Created" value={property.created || "Unknown"} />
        </div>

        <div className="mt-8 space-y-3">
          {property.status !== "Approved" && (
            <button
              onClick={() => onApprove(property.id)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-white hover:bg-emerald-600"
            >
              <CheckCircle size={18} />
              Approve Property
            </button>
          )}

          {property.status !== "Rejected" && (
            <button
              onClick={() => onReject(property.id)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-bold text-red-600 hover:bg-red-100"
            >
              <XCircle size={18} />
              Reject Property
            </button>
          )}

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Delete Listing
          </button>
        </div>
      </aside>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase text-gray-400">{title}</p>
      <p className="mt-1 font-bold text-gray-950">{value}</p>
    </div>
  );
}

function Badge({ status, inline = false }) {
  const style =
    status === "Approved"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Pending"
        ? "bg-yellow-50 text-yellow-600"
        : "bg-red-50 text-red-600";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${style} ${
        inline ? "" : "absolute left-4 top-4"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[1.7rem] border p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        active ? "border-rose-500 bg-rose-50" : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-black">{value}</h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            active ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-500"
          }`}
        >
          <Icon size={24} />
        </div>
      </div>
    </button>
  );
}
