import { useMemo } from "react";
import { Heart, ChevronRight } from "lucide-react";

export default function PropertySection({
  title,
  properties = [],
  activeSearch = "",
}) {
  const filteredProperties = useMemo(() => {
    const search = activeSearch.trim().toLowerCase();

    if (!search) return properties;

    return properties.filter((property) => {
      const title = property.title?.toLowerCase() || "";
      const location = property.location?.toLowerCase() || "";

      return title.includes(search) || location.includes(search);
    });
  }, [properties, activeSearch]);

  if (!filteredProperties.length) return null;

  return (
    <section className="px-6 py-6 md:px-8">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-950">{title}</h2>

        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth pb-3">
        {filteredProperties.map((property) => (
          <article
            key={property.id}
            className="group w-52 shrink-0 cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={property.image}
                alt={property.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
                Guest favourite
              </span>

              <button className="absolute right-3 top-3 text-white drop-shadow-md transition hover:scale-110">
                <Heart size={25} />
              </button>
            </div>

            <div className="mt-2">
              <h3 className="truncate text-sm font-semibold text-gray-950">
                {property.title}
              </h3>

              <p className="mt-0.5 truncate text-sm text-gray-600">
                ₹{Number(property.price).toLocaleString("en-IN")} night
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
