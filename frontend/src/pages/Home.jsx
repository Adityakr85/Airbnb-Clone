import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertySection from "../components/PropertySection";
import { fetchProperties } from "../api/properties";

export default function Home() {
  const [searchParams] = useSearchParams();
  const activeSearch = searchParams.get("search") || "";

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProperties({ search: activeSearch });
        if (isMounted) setProperties(data);
      } catch (e) {
        if (isMounted) setError(e?.message || "Failed to load properties");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [activeSearch]);

  const titleTemplates = [
    "Available in",
    "Popular homes in",
    "Stay in",
    "Guest favourites in",
    "Top-rated stays in",
    "Weekend getaways in",
    "Explore",
    "Discover",
  ];

  const groupedEntries = useMemo(() => {
    const groupedProperties = (properties || []).reduce((acc, property) => {
      const location = property.location?.split(",")[0]?.trim() || "Unknown";
      if (!acc[location]) acc[location] = [];
      acc[location].push(property);
      return acc;
    }, {});

    return Object.entries(groupedProperties);
  }, [properties]);

  return loading ? (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Loading properties...</div>
    </main>
  ) : error ? (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-red-600">{error}</div>
    </main>
  ) : (
    <main className="bg-white min-h-screen">
      {groupedEntries.length > 0 ? (
        groupedEntries.map(([location, props], index) => (
          <PropertySection
            key={location}
            title={
              activeSearch
                ? `Search results in ${location}`
                : `${titleTemplates[index % titleTemplates.length]} ${location}`
            }
            properties={props}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-gray-800">
          <h2 className="text-2xl font-semibold mb-2">No exact matches</h2>
          <p className="text-gray-500">
            Try searching for a different destination like "Goa" or "Mumbai".
          </p>
          <a
            href="/"
            className="mt-6 border border-black rounded-lg px-6 py-3 font-semibold hover:bg-gray-50 transition"
          >
            Clear Search
          </a>
        </div>
      )}
    </main>
  );
}

