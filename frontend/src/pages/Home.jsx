import React from "react";
import { useSearchParams } from "react-router-dom";
import properties from "../data/properties";
import PropertySection from "../components/PropertySection";

export default function Home() {
  const [searchParams] = useSearchParams();
  const activeSearch = searchParams.get("search") || "";

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
  const handleSearchSubmit = (searchTerm) => {
    setActiveSearch(searchTerm);
  };

  const filteredProperties = properties.filter((property) => {
    if (!activeSearch) return true;

    const searchLower = activeSearch.toLowerCase();
    
    // Check if the property location or title matches the search
    return (
      property.location?.toLowerCase().includes(searchLower) ||
      property.title?.toLowerCase().includes(searchLower)
    );
  });

  // 2. NOW we group the FILTERED properties (Not the original list!)
  const groupedProperties = filteredProperties.reduce((acc, property) => {
    const location = property.location.split(",")[0].trim();

    if (!acc[location]) {
      acc[location] = [];
    }

    acc[location].push(property);

    return acc;
  }, {});
  
  const groupedEntries = Object.entries(groupedProperties);

  return (
    <main className="bg-white min-h-screen">
      
      {groupedEntries.length > 0 ? (
        groupedEntries.map(([location, props], index) => (
          <PropertySection
            key={location}
            // Dynamic Airbnb-style Titles: Changes to "Search results" when filtering
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
          <p className="text-gray-500">Try searching for a different destination like "Goa" or "Mumbai".</p>
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