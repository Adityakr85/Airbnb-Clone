import {
  Search,
  Star,
  MessageSquare,
  Trash2,
  MoreVertical,
  Flag,
} from "lucide-react";

const reviews = [
  {
    id: 1,
    user: "Rahul Sharma",
    property: "Luxury Villa in Goa",
    rating: 5,
    review: "Amazing stay, clean rooms and great host.",
    date: "Jun 12, 2026",
    status: "Published",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    user: "Sneha Verma",
    property: "Modern Apartment in Mumbai",
    rating: 4,
    review: "Good location and smooth check-in experience.",
    date: "Jun 14, 2026",
    status: "Published",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    user: "Amit Kumar",
    property: "Mountain Stay in Manali",
    rating: 2,
    review: "The place was not as clean as shown in photos.",
    date: "Jun 15, 2026",
    status: "Flagged",
    image: "https://i.pravatar.cc/150?img=8",
  },
];

export default function Reviews() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="mt-1 text-gray-500">
          Monitor guest feedback, ratings, and reported reviews.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard title="Total Reviews" value="2,450" icon={MessageSquare} />
        <StatCard title="Average Rating" value="4.8" icon={Star} />
        <StatCard title="Flagged Reviews" value="18" icon={Flag} />
      </div>

      <div className="flex flex-col gap-4 rounded-[1.7rem] bg-white p-5 shadow-sm lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
          />
        </div>

        <select className="rounded-xl border border-gray-200 px-4 py-3 outline-none">
          <option>All Ratings</option>
          <option>5 Stars</option>
          <option>4 Stars</option>
          <option>3 Stars</option>
          <option>2 Stars</option>
          <option>1 Star</option>
        </select>

        <select className="rounded-xl border border-gray-200 px-4 py-3 outline-none">
          <option>All Status</option>
          <option>Published</option>
          <option>Flagged</option>
        </select>
      </div>

      <div className="grid gap-5">
        {reviews.map((item) => (
          <div
            key={item.id}
            className="rounded-[1.7rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.user}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-bold text-gray-950">{item.user}</h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.status === "Published"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Reviewed {item.property} · {item.date}
                  </p>

                  <div className="mt-3 flex text-rose-500">
                    {Array.from({ length: item.rating }).map((_, index) => (
                      <Star key={index} size={18} fill="currentColor" />
                    ))}
                  </div>

                  <p className="mt-4 max-w-3xl text-gray-700">{item.review}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100">
                  <Trash2 size={16} className="inline" /> Delete
                </button>

                <button className="rounded-full p-2 transition hover:bg-gray-100">
                  <MoreVertical size={18} />
                </button>
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
