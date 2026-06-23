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
  Eye,
} from "lucide-react";
import { fetchAdminProperties } from "../../api/admin";

const propertiesData = [
  {
    id: 1,
    title: "Luxury Villa in Goa",
    host: "Rahul Sharma",
    location: "Goa, India",
    price: "₹12,500",
    status: "Approved",
    rating: 4.9,
    bookings: 28,
    type: "Villa",
    created: "Jun 10, 2026",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=900",
  },
  {
    id: 2,
    title: "Modern Apartment in Mumbai",
    host: "Sneha Verma",
    location: "Mumbai, India",
    price: "₹8,200",
    status: "Pending",
    rating: 4.6,
    bookings: 12,
    type: "Apartment",
    created: "Jun 14, 2026",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=900",
  },
  {
    id: 3,
    title: "Mountain Stay in Manali",
    host: "Amit Kumar",
    location: "Manali, India",
    price: "₹10,000",
    status: "Rejected",
    rating: 4.4,
    bookings: 8,
    type: "Cabin",
    created: "Jun 16, 2026",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900",
  },
];

export default function Properties() {
  const { user, isLoaded } = useUser();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      if (!isLoaded) return;

      const clerkId = user?.id;
      if (!clerkId) {
        setProperties([]);
        setError("Unable to load properties: User not authenticated");
        return;
      }

      const data = await fetchAdminProperties(clerkId);
      setProperties(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load properties:", err);
      setError("Failed to load properties. Please try again later.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchProperties();

    // Set up polling for real-time updates (every 5 seconds)
    const intervalId = setInterval(fetchProperties, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        property.host.toLowerCase().includes(search.toLowerCase()) ||
        property.location.toLowerCase().includes(search.toLowerCase());

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
        <StatCard title="Total Properties" value={properties.length} icon={Home} />
        <StatCard title="Approved" value={properties.filter(p => p.status === 'Approved').length} icon={CheckCircle} />
        <StatCard title="Pending" value={properties.filter(p => p.status === 'Pending').length} icon={Clock} />
        <StatCard title="Rejected" value={properties.filter(p => p.status === 'Rejected').length} icon={XCircle} />
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
              onChange={handleSearchChange}
              type="text"
              placeholder="Search by title, host, or location..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={status}
            onChange={handleStatusChange}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="overflow-hidden rounded-[1.8rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-56">
              <img
                src={property.image}
                alt={property.title}
                className="h-full w-full object-cover"
              />

              <Badge status={property.status} />

              <button
                onClick={() => setSelectedProperty(property)}
                className="absolute right-4 top-4 rounded-full bg-white/90 p-2 transition hover:bg-white"
              >
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="p-5">
              <h2 className="truncate text-lg font-black">{property.title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Hosted by {property.host}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                {property.location}
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <span>{property.type}</span>
                <span className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="text-rose-500"
                    fill="currentColor"
                  />
                  {property.rating}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xl font-black">{property.price}</p>
                  <p className="text-xs text-gray-500">per night</p>
                </div>

                <button
                  onClick={() => setSelectedProperty(property)}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold transition hover:bg-gray-200"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
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
              placeholder="Search by title, host, or location..."
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

      <div className="grid gap-6 xl:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="overflow-hidden rounded-[1.8rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-56">
              <img
                src={property.image}
                alt={property.title}
                className="h-full w-full object-cover"
              />

              <Badge status={property.status} />

              <button
                onClick={() => setSelectedProperty(property)}
                className="absolute right-4 top-4 rounded-full bg-white/90 p-2 transition hover:bg-white"
              >
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="p-5">
              <h2 className="truncate text-lg font-black">{property.title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Hosted by {property.host}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                {property.location}
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <span>{property.type}</span>
                <span className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="text-rose-500"
                    fill="currentColor"
                  />
                  {property.rating}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xl font-black">{property.price}</p>
                  <p className="text-xs text-gray-500">per night</p>
                </div>

                <button
                  onClick={() => setSelectedProperty(property)}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold transition hover:bg-gray-200"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProperty && (
        <PropertyDrawer
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}

function PropertyDrawer({ property, onClose }) {
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
          src={property.image}
          alt={property.title}
          className="mt-6 h-64 w-full rounded-[1.5rem] object-cover"
        />

        <div className="mt-6">
          <Badge status={property.status} />
          <h3 className="mt-4 text-2xl font-black">{property.title}</h3>
          <p className="mt-1 text-gray-500">Hosted by {property.host}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="Location" value={property.location} />
          <Info title="Type" value={property.type} />
          <Info title="Price" value={property.price} />
          <Info title="Rating" value={property.rating} />
          <Info title="Bookings" value={property.bookings} />
          <Info title="Created" value={property.created} />
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-white hover:bg-emerald-600">
            <CheckCircle size={18} />
            Approve Property
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-50 px-5 py-3 font-bold text-yellow-700 hover:bg-yellow-100">
            <Eye size={18} />
            Mark as Pending
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-bold text-red-600 hover:bg-red-100">
            <XCircle size={18} />
            Reject Property
          </button>

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

function Badge({ status }) {
  const style =
    status === "Approved"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Pending"
        ? "bg-yellow-50 text-yellow-600"
        : "bg-red-50 text-red-600";

  return (
    <span
      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black ${style}`}
    >
      {status}
    </span>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-black">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
