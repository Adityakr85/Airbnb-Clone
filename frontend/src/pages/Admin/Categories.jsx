import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Grid3X3,
  Home,
  Compass,
  EyeOff,
  MoreVertical,
  X,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

const categoriesData = [
  {
    id: 1,
    name: "Beachfront",
    type: "Property",
    icon: "🏖️",
    listings: 42,
    status: "Active",
    created: "Jun 10, 2026",
    description: "Properties located near beaches and sea-facing areas.",
  },
  {
    id: 2,
    name: "Cabins",
    type: "Property",
    icon: "🏕️",
    listings: 28,
    status: "Active",
    created: "Jun 12, 2026",
    description: "Cozy cabins, cottages, and wooden stays.",
  },
  {
    id: 3,
    name: "Cooking Classes",
    type: "Experience",
    icon: "🍳",
    listings: 16,
    status: "Active",
    created: "Jun 14, 2026",
    description: "Food experiences, cooking sessions, and local cuisine tours.",
  },
  {
    id: 4,
    name: "Adventure",
    type: "Experience",
    icon: "🧗",
    listings: 22,
    status: "Hidden",
    created: "Jun 16, 2026",
    description: "Trekking, hiking, sports, and outdoor adventure activities.",
  },
];

export default function Categories() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = useMemo(() => {
    return categoriesData.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.type.toLowerCase().includes(search.toLowerCase());

      const matchesType = type === "All" || category.type === type;
      const matchesStatus = status === "All" || category.status === status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, type, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Categories</h1>
          <p className="mt-1 text-gray-500">
            Manage property and experience categories, visibility, and listing
            groups.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
            <Download size={18} />
            Export
          </button>

          <button className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600">
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Categories" value="48" icon={Grid3X3} />
        <StatCard title="Property Types" value="30" icon={Home} />
        <StatCard title="Experience Types" value="18" icon={Compass} />
        <StatCard title="Hidden" value="6" icon={EyeOff} />
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
              placeholder="Search categories..."
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

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Active</option>
            <option>Hidden</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-[1.8rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.3rem] bg-gray-100 text-3xl">
                {category.icon}
              </div>

              <button
                onClick={() => setSelectedCategory(category)}
                className="rounded-full p-2 transition hover:bg-gray-100"
              >
                <MoreVertical size={18} />
              </button>
            </div>

            <h2 className="mt-5 text-xl font-black">{category.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{category.type}</p>

            <p className="mt-4 line-clamp-2 text-sm text-gray-600">
              {category.description}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-600">
                {category.listings} listings
              </span>

              <Badge status={category.status} />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setSelectedCategory(category)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 py-2 text-sm font-bold transition hover:bg-gray-200"
              >
                <Edit size={15} />
                Manage
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <CategoryDrawer
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}

function CategoryDrawer({ category, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Category Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gray-100 text-5xl">
            {category.icon}
          </div>

          <h3 className="mt-5 text-2xl font-black">{category.name}</h3>
          <p className="mt-1 text-gray-500">{category.type}</p>

          <div className="mt-4">
            <Badge status={category.status} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Info title="Listings" value={category.listings} />
          <Info title="Created" value={category.created} />
          <Info title="Type" value={category.type} />
          <Info title="Status" value={category.status} />
        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-bold uppercase text-gray-400">
            Description
          </p>
          <p className="mt-2 text-sm font-medium text-gray-700">
            {category.description}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800">
            <Edit size={18} />
            Edit Category
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-50 px-5 py-3 font-bold text-yellow-700 hover:bg-yellow-100">
            <EyeOff size={18} />
            Hide Category
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 font-bold text-emerald-600 hover:bg-emerald-100">
            <Eye size={18} />
            Make Active
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Delete Category
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
    status === "Active"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-yellow-50 text-yellow-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
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
