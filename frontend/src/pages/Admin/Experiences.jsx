import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Compass,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Star,
  MoreVertical,
  X,
  Trash2,
  Eye,
  Timer,
} from "lucide-react";

const experiencesData = [
  {
    id: 1,
    title: "Goa Beach Photography Walk",
    host: "Rahul Sharma",
    location: "Goa, India",
    price: "₹2,499",
    status: "Approved",
    rating: 4.9,
    bookings: 32,
    duration: "3 hours",
    category: "Photography",
    created: "Jun 10, 2026",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900",
  },
  {
    id: 2,
    title: "Mumbai Street Food Tour",
    host: "Sneha Verma",
    location: "Mumbai, India",
    price: "₹1,799",
    status: "Pending",
    rating: 4.7,
    bookings: 18,
    duration: "2.5 hours",
    category: "Food",
    created: "Jun 14, 2026",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=900",
  },
  {
    id: 3,
    title: "Manali Mountain Trek",
    host: "Amit Kumar",
    location: "Manali, India",
    price: "₹3,999",
    status: "Rejected",
    rating: 4.6,
    bookings: 9,
    duration: "6 hours",
    category: "Adventure",
    created: "Jun 16, 2026",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900",
  },
];

export default function Experiences() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState(null);

  const experiences = useMemo(() => {
    return experiencesData.filter((experience) => {
      const matchesSearch =
        experience.title.toLowerCase().includes(search.toLowerCase()) ||
        experience.host.toLowerCase().includes(search.toLowerCase()) ||
        experience.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || experience.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Experiences</h1>
          <p className="mt-1 text-gray-500">
            Manage hosted activities, tours, events, and experience approvals.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export Experiences
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Experiences" value="156" icon={Compass} />
        <StatCard title="Approved" value="124" icon={CheckCircle} />
        <StatCard title="Pending" value="22" icon={Clock} />
        <StatCard title="Rejected" value="10" icon={XCircle} />
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
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="overflow-hidden rounded-[1.8rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-56">
              <img
                src={experience.image}
                alt={experience.title}
                className="h-full w-full object-cover"
              />

              <Badge status={experience.status} />

              <button
                onClick={() => setSelectedExperience(experience)}
                className="absolute right-4 top-4 rounded-full bg-white/90 p-2 transition hover:bg-white"
              >
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="p-5">
              <h2 className="truncate text-lg font-black">
                {experience.title}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Hosted by {experience.host}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                {experience.location}
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Timer size={16} />
                  {experience.duration}
                </span>

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
                  <p className="text-xl font-black">{experience.price}</p>
                  <p className="text-xs text-gray-500">per person</p>
                </div>

                <button
                  onClick={() => setSelectedExperience(experience)}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold transition hover:bg-gray-200"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedExperience && (
        <ExperienceDrawer
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </div>
  );
}

function ExperienceDrawer({ experience, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Experience Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <img
          src={experience.image}
          alt={experience.title}
          className="mt-6 h-64 w-full rounded-[1.5rem] object-cover"
        />

        <div className="mt-6">
          <Badge status={experience.status} />
          <h3 className="mt-4 text-2xl font-black">{experience.title}</h3>
          <p className="mt-1 text-gray-500">Hosted by {experience.host}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="Location" value={experience.location} />
          <Info title="Category" value={experience.category} />
          <Info title="Duration" value={experience.duration} />
          <Info title="Price" value={experience.price} />
          <Info title="Rating" value={experience.rating} />
          <Info title="Bookings" value={experience.bookings} />
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-white hover:bg-emerald-600">
            <CheckCircle size={18} />
            Approve Experience
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-50 px-5 py-3 font-bold text-yellow-700 hover:bg-yellow-100">
            <Eye size={18} />
            Mark as Pending
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-bold text-red-600 hover:bg-red-100">
            <XCircle size={18} />
            Reject Experience
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Delete Experience
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
