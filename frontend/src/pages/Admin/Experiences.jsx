import {
  Search,
  Plus,
  Compass,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Star,
  MoreVertical,
} from "lucide-react";

const experiences = [
  {
    id: 1,
    title: "Goa Beach Photography Walk",
    host: "Rahul Sharma",
    location: "Goa, India",
    price: "₹2,499",
    duration: "3 hours",
    rating: 4.9,
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
  },
  {
    id: 2,
    title: "Mumbai Street Food Tour",
    host: "Sneha Verma",
    location: "Mumbai, India",
    price: "₹1,799",
    duration: "2.5 hours",
    rating: 4.7,
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800",
  },
  {
    id: 3,
    title: "Manali Mountain Trek",
    host: "Amit Kumar",
    location: "Manali, India",
    price: "₹3,999",
    duration: "6 hours",
    rating: 4.6,
    status: "Rejected",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800",
  },
];

export default function Experiences() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Experiences</h1>
          <p className="mt-1 text-gray-500">
            Manage hosted activities, tours, events, and experience approvals.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600">
          <Plus size={18} />
          Add Experience
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Experiences" value="156" icon={Compass} />
        <StatCard title="Approved" value="124" icon={CheckCircle} />
        <StatCard title="Pending" value="22" icon={Clock} />
        <StatCard title="Rejected" value="10" icon={XCircle} />
      </div>

      <div className="flex flex-col gap-4 rounded-[1.7rem] bg-white p-5 shadow-sm lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search experiences..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
          />
        </div>

        <select className="rounded-xl border border-gray-200 px-4 py-3 outline-none">
          <option>All Status</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="overflow-hidden rounded-[1.7rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-56">
              <img
                src={experience.image}
                alt={experience.title}
                className="h-full w-full object-cover"
              />

              <span
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
                  experience.status === "Approved"
                    ? "bg-emerald-50 text-emerald-600"
                    : experience.status === "Pending"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-red-50 text-red-600"
                }`}
              >
                {experience.status}
              </span>

              <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 transition hover:bg-white">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="p-5">
              <h2 className="truncate text-lg font-bold">{experience.title}</h2>

              <p className="mt-1 text-sm text-gray-500">
                Hosted by {experience.host}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                {experience.location}
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <span>{experience.duration}</span>

                <span className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="text-rose-500"
                    fill="currentColor"
                  />
                  {experience.rating}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold">{experience.price}</p>
                  <p className="text-xs text-gray-500">per person</p>
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
