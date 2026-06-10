import { useMemo } from "react";
import properties from "../../data/properties";

const CITY_ICONS = {
  Goa: "🏖️",
  Mumbai: "🏙️",
  Manali: "⛰️",
  Udaipur: "🏰",
  Rishikesh: "🧘",
  Bangalore: "💻",
  Nainital: "🛶",
  Jaisalmer: "🐫",
  Pondicherry: "🌊",
  Wayanad: "🌳",
  Shimla: "❄️",
  Pune: "🌆",
  Ranchi: "🌲",
  Puri: "🛕",
};

export default function WhereDropdown({
  destinationSearch,
  setDestinationSearch,
  advanceToNext,
}) {
  const regions = useMemo(() => {
    const cities = [
      ...new Set(
        properties.map((property) => property.location.split(",")[0].trim()),
      ),
    ];

    return [
      {
        id: "flexible",
        name: "I'm flexible",
        icon: "🗺️",
        searchTerm: "",
      },

      ...cities.map((city) => ({
        id: city.toLowerCase().replace(/\s+/g, "-"),
        name: city,
        icon: CITY_ICONS[city] || "📍",
        searchTerm: city,
      })),
    ];
  }, []);

  const filteredRegions = useMemo(() => {
    if (!destinationSearch) return regions;

    return regions.filter((region) =>
      region.name.toLowerCase().includes(destinationSearch.toLowerCase()),
    );
  }, [destinationSearch, regions]);

  const handleSelect = (searchTerm) => {
    setDestinationSearch(searchTerm);

    if (advanceToNext) {
      advanceToNext();
    }
  };

  return (
    <div className="absolute left-0 top-full z-50 mt-4 w-96 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
      <div className="max-h-96 overflow-y-auto px-2 scrollbar-hide">
        {filteredRegions.length > 0 ? (
          filteredRegions.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => handleSelect(region.searchTerm)}
              className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-gray-100"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                {region.icon}
              </div>

              <span className="font-medium text-gray-800">{region.name}</span>
            </button>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            No destinations found for "{destinationSearch}"
          </div>
        )}
      </div>
    </div>
  );
}
