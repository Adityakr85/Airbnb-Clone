import { useEffect, useState } from "react";
import PropertySection from "../components/PropertySection";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetch("http://localhost:8000/api/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProperties(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-24 text-center">Loading properties...</div>;
  }

  // Group properties by location
  const groupedProperties = properties.reduce((acc, property) => {
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
      {groupedEntries.length === 0 ? (
        <div className="p-24 text-center">No properties found.</div>
      ) : (
        groupedEntries.map(([location, props], index) => (
          <PropertySection
            key={location}
            title={`${titleTemplates[index % titleTemplates.length]} ${location}`}
            properties={props}
          />
        ))
      )}
    </main>
  );
}
