import {
  Search,
  Home,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  MapPin,
  Star,
} from "lucide-react";

const properties = [
  {
    id: 1,
    title: "Luxury Villa in Goa",
    host: "Rahul Sharma",
    location: "Goa, India",
    price: "₹12,500",
    status: "Approved",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800",
  },
  {
    id: 2,
    title: "Modern Apartment in Mumbai",
    host: "Sneha Verma",
    location: "Mumbai, India",
    price: "₹8,200",
    status: "Pending",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800",
  },
  {
    id: 3,
    title: "Mountain Stay in Manali",
    host: "Amit Kumar",
    location: "Manali, India",
    price: "₹10,000",
    status: "Rejected",
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800",
  },
];

export default function Properties() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Properties</h1>
        <p className="mt-1 text-gray-500">
          Review, approve, reject, and manage property listings.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Properties" value="324" icon={Home} />
        <StatCard title="Approved" value="286" icon={CheckCircle} />
        <StatCard title="Pending" value="27" icon={Clock} />
        <StatCard title="Rejected" value="11" icon={XCircle} />
      </div>

      <div className="flex flex-col gap-4 rounded-[1.7rem] bg-white p-5 shadow-sm lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search properties..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
          />
        </div>

        <select className="rounded-xl border border-gray-200 px-4 py-3 outline-none">
          <option>All Status</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>

        <button className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600">
          Add Property
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="overflow-hidden rounded-[1.7rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-56">
              <img
                src={property.image}
                alt={property.title}
                className="h-full w-full object-cover"
              />

              <span
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
                  property.status === "Approved"
                    ? "bg-emerald-50 text-emerald-600"
                    : property.status === "Pending"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-red-50 text-red-600"
                }`}
              >
                {property.status}
              </span>

              <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 transition hover:bg-white">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="p-5">
              <h2 className="truncate text-lg font-bold">{property.title}</h2>

              <p className="mt-1 text-sm text-gray-500">
                Hosted by {property.host}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                {property.location}
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <Star size={16} className="text-rose-500" fill="currentColor" />
                {property.rating}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold">{property.price}</p>
                  <p className="text-xs text-gray-500">per night</p>
                </div>

                <div className="flex gap-2">
                  <button className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600 transition hover:bg-emerald-100">
                    Approve
                  </button>

                  <button className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
