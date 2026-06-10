import React from 'react';
import { MapPin } from 'lucide-react';
import properties from '../data/properties';

const WhereDropdown = ({ destinationSearch,setDestinationSearch , advanceToNext }) => {
  const uniqueCities = [...new Set(properties.map(property => property.location.split(",")[0].trim()))];
  
  const getCityIcon = (city) => {
    const icons = {
      "Goa": "🏖️", "Mumbai": "🏙️", "Manali": "⛰️", "Udaipur": "🏰",
      "Rishikesh": "🧘", "Bangalore": "💻", "Nainital": "🛶", "Jaisalmer": "🐫",
      "Pondicherry": "🌊", "Wayanad": "🌳", "Shimla": "❄️", "Pune": "🌆", 
      "Ranchi": "🌲", "Puri": "🛕"
    };
    return icons[city] || "📍"; // Fallback to a map pin if city isn't in the list
  };

  const allRegions = [
    { id: 'flexible', name: "I'm flexible", icon: "🗺️", searchTerm: "" },
    ...uniqueCities.map((city) => ({
      id: city.toLowerCase().replace(/\s+/g, '-'),
      name: city,
      icon: getCityIcon(city),
      searchTerm: city
    }))
  ];
  const filteredRegions = allRegions.filter(region => {
    if (!destinationSearch) return true;
    return region.name.toLowerCase().includes(destinationSearch.toLowerCase());
  });

  const handleRegionClick = (searchTerm) => {
    if (setDestinationSearch) {
      setDestinationSearch(searchTerm);
    }
    if (advanceToNext) {
      advanceToNext();
    }
  };

  return (
    <div className="absolute top-full mt-4 left-0 w-[400px] bg-white rounded-3xl shadow-xl border border-gray-200 p-6 z-50">
      
      
      <div className="max-h-[350px] overflow-y-auto px-4 scrollbar-hide">
        {filteredRegions.length > 0 ? (
          filteredRegions.map((region) => (
            /* Rendered as vertical bars/rows instead of a grid */
            <div 
              key={region.id}
              onClick={() => handleRegionClick(region.searchTerm)}
              className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                {region.icon}
              </div>
              <span className="text-base font-medium text-gray-800">
                {region.name}
              </span>
            </div>
          ))
        ) : (
          /* Show a helpful message if they type a city you don't have */
          <div className="px-4 py-6 text-center text-gray-500">
            No destinations match "{destinationSearch}"
          </div>
        )}
      </div>
      
    </div>
  );
};

export default WhereDropdown;