import { Heart, ChevronRight } from "lucide-react";

export default function PropertySection({ title, properties = [], activeSearch = "" }) {
  const filteredProperties = properties.filter((property) => {
    // 2. Filter the properties BEFORE we render them
    if (!activeSearch) return true;
    const searchLower = activeSearch.toLowerCase();
    return (
    property.title?.toLowerCase().includes(searchLower) ||
    property.location?.toLowerCase().includes(searchLower)
   );
});
  
  if (!properties.length) return null;

  return (
    <section className="px-6 md:px-8 py-6">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-950">{title}</h2>

          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Cards */}
      {filteredProperties.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto scroll-smooth pb-3 scrollbar-hide">
          {/* Map over filteredProperties instead of properties */}
          {filteredProperties.map((property) => (
            <article
              key={property.id}
              className="group min-w-[205px] max-w-[205px] cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-[195px] overflow-hidden rounded-2xl bg-gray-100">
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

              {/* Details */}
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
      ) : (
        /* The Empty State for Searches with no matches */
        <div className="flex flex-col items-center justify-center py-10 text-gray-800 w-full border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <h3 className="text-lg font-semibold mb-1">No exact matches in {title}</h3>
          <p className="text-sm text-gray-500">Try searching for a different destination.</p>
        </div>
      )}
    </section>
  );
}
