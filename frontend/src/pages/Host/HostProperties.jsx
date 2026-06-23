import { Link } from "react-router-dom";
import { Home, Star, Eye, IndianRupee, Plus } from "lucide-react";
import { useHost } from "./HostContext";

export default function HostProperties() {
  const { properties } = useHost();

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Listings</h1>
            <p className="mt-1 text-gray-500">
              Manage all your listed properties.
            </p>
          </div>

          <Link
            to="/host/add-property"
            className="flex items-center gap-2 rounded-full bg-[#FF385C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E31C5F]"
          >
            <Plus size={16} />
            Add property
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {properties.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <Home size={40} className="mx-auto mb-3 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900">
              No listings yet
            </h2>
            <p className="mt-1 text-gray-500">
              Add your first property to start hosting.
            </p>

            <Link
              to="/host/add-property"
              className="mt-6 inline-flex rounded-full bg-[#FF385C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#E31C5F]"
            >
              Add property
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {properties.map((p) => (
              <div
                key={p.id}
                className="flex gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <img
                  src={`${p.image}?w=260&q=75`}
                  alt={p.title}
                  className="h-40 w-56 rounded-xl object-cover"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {p.title}
                        </h2>
                        <p className="text-sm text-gray-500">{p.location}</p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          p.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.status || "active"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        {p.rating || "New"}
                      </span>

                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {p.views || 0} views
                      </span>

                      <span className="flex items-center gap-1">
                        <IndianRupee size={14} />₹
                        {Number(p.price || 0).toLocaleString("en-IN")} / night
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:bg-gray-50">
                      Edit
                    </button>

                    <button className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
