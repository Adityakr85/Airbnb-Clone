import { useEffect, useState } from "react";
import properties from "../../data/properties";

export default function Wishlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadWishlist = () => {
      const savedIds =
        JSON.parse(localStorage.getItem("wishlist")) || [];

      const savedProperties = properties.filter((property) =>
        savedIds.includes(property.id)
      );

      setItems(savedProperties);
    };

    loadWishlist();

    window.addEventListener(
      "wishlistUpdated",
      loadWishlist
    );

    return () =>
      window.removeEventListener(
        "wishlistUpdated",
        loadWishlist
      );
  }, []);

  const removeProperty = (id) => {
    const savedIds =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const updatedIds = savedIds.filter(
      (propertyId) => propertyId !== id
    );

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedIds)
    );

    setItems((prev) =>
      prev.filter((property) => property.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">
            Wishlist
          </h1>

          <p className="mt-1 text-gray-600">
            {items.length} saved{" "}
            {items.length === 1
              ? "property"
              : "properties"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl">🤍</div>

            <h3 className="mt-4 text-2xl font-semibold">
              No saved properties yet
            </h3>

            <p className="mt-2 max-w-md text-gray-500">
              Start exploring stays and save the
              ones you love for future trips.
            </p>

            <button className="mt-6 rounded-full bg-black px-6 py-3 text-white transition hover:opacity-90">
              Explore homes
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((property) => (
              <div
                key={property.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl"
              >
                <div className="relative">
                   <img
                     src={property.images?.[0] || "/placeholder.jpg"}
                     alt={property.title}
                     className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                   />

                  <button
                    onClick={() =>
                      removeProperty(property.id)
                    }
                    className="absolute right-3 top-3 rounded-full bg-white p-2 shadow transition hover:scale-105"
                  >
                    ❤️
                  </button>

                  <div className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1 text-sm font-medium shadow">
                    ⭐ {property.rating}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
                      {property.title}
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {property.type || "Property"}
                  </p>

                  <p className="mt-3 text-sm text-gray-700">
                    📍 {property.location}
                  </p>

                  <p className="text-sm text-gray-700">
                    👥 {property.guests || "N/A"} guests
                  </p>

                  <p className="text-sm text-gray-700">
                    🛏️{" "}
                    {property.bedrooms || "N/A"}{" "}
                    bedrooms • 🚿{" "}
                    {property.bathrooms || "N/A"}{" "}
                    bathrooms
                  </p>

                  <p className="mt-3 text-lg font-semibold text-gray-900">
                    ₹
                    {property.price.toLocaleString(
                      "en-IN"
                    )}{" "}
                    / night
                  </p>

                  <button className="mt-4 w-full rounded-xl bg-[#FF385C] py-3 font-medium text-white transition hover:bg-[#E31C5F]">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}