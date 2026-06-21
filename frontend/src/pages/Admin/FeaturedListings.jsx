import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Sparkles,
  Home,
  Compass,
  Eye,
  MoreVertical,
  X,
  Star,
  Trash2,
  CheckCircle,
} from "lucide-react";

const featuredData = [
  {
    id: "FEA-1001",
    title: "Luxury Villa in Goa",
    type: "Property",
    host: "Rahul Sharma",
    location: "Goa, India",
    status: "Featured",
    rating: 4.9,
    views: 12480,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=900",
  },
  {
    id: "FEA-1002",
    title: "Mumbai Street Food Tour",
    type: "Experience",
    host: "Sneha Verma",
    location: "Mumbai, India",
    status: "Featured",
    rating: 4.7,
    views: 8420,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=900",
  },
  {
    id: "FEA-1003",
    title: "Mountain Cabin Stay",
    type: "Property",
    host: "Amit Kumar",
    location: "Manali, India",
    status: "Inactive",
    rating: 4.6,
    views: 5320,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900",
  },
];

export default function FeaturedListings() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  const listings = useMemo(() => {
    return featuredData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.host.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());

      const matchesType = type === "All" || item.type === type;

      return matchesSearch && matchesType;
    });
  }, [search, type]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Featured Listings
          </h1>
          <p className="mt-1 text-gray-500">
            Manage highlighted properties and experiences shown on homepage.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export Featured
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Featured Total" value="42" icon={Sparkles} />
        <StatCard title="Properties" value="26" icon={Home} />
        <StatCard title="Experiences" value="16" icon={Compass} />
        <StatCard title="Total Views" value="1.2M" icon={Eye} />
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
              placeholder="Search featured listings..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Property</option>
            <option>Experience</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {listings.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-[1.8rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-56">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />

              <span
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black ${
                  item.status === "Featured"
                    ? "bg-rose-50 text-rose-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {item.status}
              </span>

              <button
                onClick={() => setSelectedItem(item)}
                className="absolute right-4 top-4 rounded-full bg-white/90 p-2 transition hover:bg-white"
              >
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 text-rose-500">
                {item.type === "Property" ? (
                  <Home size={17} />
                ) : (
                  <Compass size={17} />
                )}
                <span className="text-sm font-black">{item.type}</span>
              </div>

              <h2 className="mt-3 truncate text-lg font-black">{item.title}</h2>

              <p className="mt-1 text-sm text-gray-500">
                Hosted by {item.host}
              </p>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>{item.location}</span>

                <span className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="text-rose-500"
                    fill="currentColor"
                  />
                  {item.rating}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between border-t pt-5">
                <div>
                  <p className="text-xs font-black uppercase text-gray-400">
                    Views
                  </p>
                  <p className="text-xl font-black">{item.views}</p>
                </div>

                <button
                  onClick={() => setSelectedItem(item)}
                  className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <FeaturedDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

function FeaturedDrawer({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Featured Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <img
          src={item.image}
          alt={item.title}
          className="mt-6 h-64 w-full rounded-[1.5rem] object-cover"
        />

        <div className="mt-6">
          <h3 className="text-2xl font-black">{item.title}</h3>
          <p className="mt-1 text-gray-500">{item.location}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="ID" value={item.id} />
          <Info title="Type" value={item.type} />
          <Info title="Host" value={item.host} />
          <Info title="Status" value={item.status} />
          <Info title="Rating" value={item.rating} />
          <Info title="Views" value={item.views} />
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600">
            <Sparkles size={18} />
            Feature Listing
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 font-bold text-emerald-600 hover:bg-emerald-100">
            <CheckCircle size={18} />
            Mark Active
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Remove Featured
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

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <h2 className="mt-2 text-2xl font-black">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
