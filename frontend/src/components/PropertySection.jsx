import { useMemo, useState, useEffect } from "react";
import { Heart, ChevronRight } from "lucide-react";

function getPropertyImageSrc(property) {
  const imageFromSingle =
    typeof property.image === "string" ? property.image.trim() : "";

  const imageFromArray =
    Array.isArray(property.image_urls) &&
    property.image_urls.length
      ? property.image_urls.find(
          (url) => typeof url === "string" && url.trim()
        )
      : "";

  const imageSrc = imageFromSingle || imageFromArray || "";

  if (!imageSrc) return "";

  if (
    imageSrc.includes("images.unsplash.com/") &&
    !imageSrc.includes("?")
  ) {
    return `${imageSrc}?auto=format&fit=crop&w=600&q=80`;
  }

  return imageSrc;
}

export default function PropertySection({
  title,
  properties = [],
  activeSearch = "",
}) {
  const filteredProperties = useMemo(() => {
    const search = activeSearch.trim().toLowerCase();

    if (!search) return properties;

    return properties.filter((property) => {
      const propertyTitle =
        property.title?.toLowerCase() || "";
      const location =
        property.location?.toLowerCase() || "";

      return (
        propertyTitle.includes(search) ||
        location.includes(search)
      );
    });
  }, [properties, activeSearch]);

  const [imageErrors, setImageErrors] = useState(
    () => new Set()
  );

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(savedWishlist);

    const syncWishlist = () => {
      const latestWishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

      setWishlist(latestWishlist);
    };

    window.addEventListener(
      "wishlistUpdated",
      syncWishlist
    );

    return () =>
      window.removeEventListener(
        "wishlistUpdated",
        syncWishlist
      );
  }, []);

  if (!filteredProperties.length) return null;

  return (
    <section className="px-6 py-6 md:px-8">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-950">
          {title}
        </h2>

        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth pb-3">
        {filteredProperties.map((property) => {
          const description =
            property.description?.trim() ||
            "A great place to stay - book for more details.";

          const imageSrc =
            getPropertyImageSrc(property);

          const hasImage = Boolean(imageSrc);

          const rawPrice =
            property.price ??
            property.price_per_night ??
            property.base_price;

          const priceNumber = Number(rawPrice);

          const imageKey =
            property.id ??
            `${property.title}-${property.location}`;

          return (
            <article
              key={property.id}
              className="group w-52 shrink-0 cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden rounded-2xl bg-gray-100">
                {hasImage &&
                  !imageErrors.has(imageKey) && (
                    <img
                      src={imageSrc}
                      alt={
                        property.title || "Property"
                      }
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() => {
                        setImageErrors((prev) => {
                          const next = new Set(prev);
                          next.add(imageKey);
                          return next;
                        });
                      }}
                    />
                  )}

                {(!hasImage ||
                  imageErrors.has(imageKey)) && (
                  <div className="absolute inset-0 bg-gray-200" />
                )}

                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
                  Guest favourite
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    const savedWishlist =
                      JSON.parse(
                        localStorage.getItem(
                          "wishlist"
                        )
                      ) || [];

                    let updatedWishlist;

                    if (
                      savedWishlist.includes(
                        property.id
                      )
                    ) {
                      updatedWishlist =
                        savedWishlist.filter(
                          (id) =>
                            id !== property.id
                        );
                    } else {
                      updatedWishlist = [
                        ...savedWishlist,
                        property.id,
                      ];
                    }

                    localStorage.setItem(
                      "wishlist",
                      JSON.stringify(
                        updatedWishlist
                      )
                    );

                    setWishlist(updatedWishlist);

                    window.dispatchEvent(
                      new Event(
                        "wishlistUpdated"
                      )
                    );
                  }}
                  className="absolute right-3 top-3 drop-shadow-md transition hover:scale-110"
                >
                  <Heart
                    size={25}
                    fill={
                      wishlist.includes(property.id)
                        ? "#FF385C"
                        : "none"
                    }
                    color={
                      wishlist.includes(property.id)
                        ? "#FF385C"
                        : "white"
                    }
                  />
                </button>
              </div>

              <div className="mt-2">
                <h3 className="truncate text-sm font-semibold text-gray-950">
                  {property.title}
                </h3>

                <p className="mt-0.5 truncate text-sm text-gray-600">
                  {Number.isFinite(priceNumber)
                    ? `Rs. ${priceNumber.toLocaleString(
                        "en-IN"
                      )} night`
                    : "Rs. - night"}
                </p>

                <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                  {description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}