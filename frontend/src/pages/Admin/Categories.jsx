import {
  Search,
  Plus,
  Grid3X3,
  Home,
  Compass,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Beachfront",
    type: "Property",
    icon: "🏖️",
    items: 42,
    status: "Active",
  },
  {
    id: 2,
    name: "Cabins",
    type: "Property",
    icon: "🏕️",
    items: 28,
    status: "Active",
  },
  {
    id: 3,
    name: "Cooking Classes",
    type: "Experience",
    icon: "🍳",
    items: 16,
    status: "Active",
  },
  {
    id: 4,
    name: "Adventure",
    type: "Experience",
    icon: "🧗",
    items: 22,
    status: "Hidden",
  },
];

export default function Categories() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="mt-1 text-gray-500">
            Manage property and experience categories.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600">
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard title="Total Categories" value="48" icon={Grid3X3} />
        <StatCard title="Property Categories" value="30" icon={Home} />
        <StatCard title="Experience Categories" value="18" icon={Compass} />
      </div>

      <div className="flex flex-col gap-4 rounded-[1.7rem] bg-white p-5 shadow-sm lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search categories..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
          />
        </div>

        <select className="rounded-xl border border-gray-200 px-4 py-3 outline-none">
          <option>All Types</option>
          <option>Property</option>
          <option>Experience</option>
        </select>

        <select className="rounded-xl border border-gray-200 px-4 py-3 outline-none">
          <option>All Status</option>
          <option>Active</option>
          <option>Hidden</option>
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-[1.7rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                {category.icon}
              </div>

              <button className="rounded-full p-2 transition hover:bg-gray-100">
                <MoreVertical size={18} />
              </button>
            </div>

            <h2 className="mt-5 text-xl font-bold">{category.name}</h2>

            <p className="mt-1 text-sm text-gray-500">{category.type}</p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">
                {category.items} listings
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  category.status === "Active"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-yellow-50 text-yellow-600"
                }`}
              >
                {category.status}
              </span>
            </div>

            <div className="mt-5 flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 py-2 text-sm font-bold transition hover:bg-gray-200">
                <Edit size={15} />
                Edit
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100">
                <Trash2 size={16} />
              </button>
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
