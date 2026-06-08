import properties from "../data/properties";
import PropertySection from "../components/PropertySection";

export default function Home() {
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
      {groupedEntries.map(([location, props], index) => (
        <PropertySection
          key={location}
          title={`${titleTemplates[index % titleTemplates.length]} ${location}`}
          properties={props}
        />
      ))}
    </main>
  );
}
