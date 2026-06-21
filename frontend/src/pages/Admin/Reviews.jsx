import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Star,
  MessageSquare,
  Flag,
  Trash2,
  MoreVertical,
  X,
  Eye,
  ShieldAlert,
} from "lucide-react";

const reviewsData = [
  {
    id: 1,
    user: "Rahul Sharma",
    email: "rahul@gmail.com",
    target: "Luxury Villa in Goa",
    type: "Property",
    rating: 5,
    review: "Amazing stay, clean rooms and great host. Highly recommended.",
    date: "Jun 12, 2026",
    status: "Published",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    user: "Sneha Verma",
    email: "sneha@gmail.com",
    target: "Mumbai Street Food Tour",
    type: "Experience",
    rating: 4,
    review: "Good experience and very well organized.",
    date: "Jun 14, 2026",
    status: "Published",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    user: "Amit Kumar",
    email: "amit@gmail.com",
    target: "Mountain Stay in Manali",
    type: "Property",
    rating: 2,
    review: "The place was not as clean as shown in photos.",
    date: "Jun 15, 2026",
    status: "Flagged",
    image: "https://i.pravatar.cc/150?img=8",
  },
];

export default function Reviews() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedReview, setSelectedReview] = useState(null);

  const reviews = useMemo(() => {
    return reviewsData.filter((item) => {
      const matchesSearch =
        item.user.toLowerCase().includes(search.toLowerCase()) ||
        item.target.toLowerCase().includes(search.toLowerCase()) ||
        item.review.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Reviews</h1>
          <p className="mt-1 text-gray-500">
            Manage ratings, guest feedback, flagged reviews, and moderation.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export Reviews
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Reviews" value="2,450" icon={MessageSquare} />
        <StatCard title="Average Rating" value="4.8" icon={Star} />
        <StatCard title="Flagged" value="18" icon={Flag} />
        <StatCard title="Removed" value="42" icon={Trash2} />
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
              placeholder="Search reviews, users, or listings..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Published</option>
            <option>Flagged</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5">
        {reviews.map((item) => (
          <div
            key={item.id}
            className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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
                    <h2 className="font-black text-gray-950">{item.user}</h2>
                    <Badge status={item.status} />
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600">
                      {item.type}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Reviewed {item.target} · {item.date}
                  </p>

                  <div className="mt-3 flex text-rose-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={18}
                        fill={index < item.rating ? "currentColor" : "none"}
                        className={
                          index < item.rating
                            ? "text-rose-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="mt-4 max-w-3xl text-gray-700">{item.review}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedReview(item)}
                className="rounded-full p-2 transition hover:bg-gray-100"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedReview && (
        <ReviewDrawer
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
}

function ReviewDrawer({ review, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Review Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center text-center">
          <img
            src={review.image}
            alt={review.user}
            className="h-24 w-24 rounded-full object-cover"
          />

          <h3 className="mt-4 text-2xl font-black">{review.user}</h3>
          <p className="text-gray-500">{review.email}</p>

          <div className="mt-4">
            <Badge status={review.status} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Info title="Target" value={review.target} />
          <Info title="Type" value={review.type} />
          <Info title="Rating" value={`${review.rating}/5`} />
          <Info title="Date" value={review.date} />
        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-bold uppercase text-gray-400">Review</p>
          <p className="mt-2 text-sm font-medium text-gray-700">
            {review.review}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-white hover:bg-emerald-600">
            <Eye size={18} />
            Publish Review
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-50 px-5 py-3 font-bold text-yellow-700 hover:bg-yellow-100">
            <ShieldAlert size={18} />
            Mark as Flagged
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Delete Review
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
    status === "Published"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-red-50 text-red-600";

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
