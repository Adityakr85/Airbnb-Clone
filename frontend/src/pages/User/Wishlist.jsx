import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import GlobalCard from "../../components/GlobalCard";
import { fetchWishlist, toggleWishlist } from "../../api/wishlist";

export default function Wishlist() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    if (!isLoaded) return;

    if (!user?.id) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchWishlist(user.id);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
    };
  }, [isLoaded, user?.id]);

  const removeProperty = async (propertyId) => {
    if (!user?.id) return;

    try {
      await toggleWishlist(user.id, propertyId);

      setItems((prev) => prev.filter((property) => property.id !== propertyId));

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] px-6 py-20 text-center font-semibold">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Wishlist</h1>

          <p className="mt-1 text-gray-600">
            {items.length} saved{" "}
            {items.length === 1 ? "property" : "properties"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl">🤍</div>

            <h3 className="mt-4 text-2xl font-semibold">
              No saved properties yet
            </h3>

            <p className="mt-2 max-w-md text-gray-500">
              Start exploring stays and save the ones you love for future trips.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 rounded-full bg-black px-6 py-3 text-white transition hover:opacity-90"
            >
              Explore homes
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((property) => (
              <div key={property.id} className="relative">
                <GlobalCard property={property} item={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
