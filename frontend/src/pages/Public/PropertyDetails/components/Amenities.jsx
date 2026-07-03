// src/pages/Public/PropertyDetails/components/Amenities.jsx
export default function Amenities({ amenities = [] }) {
  return (
    <section className="border-b border-gray-200 py-8">
      <h2 className="text-2xl font-semibold text-gray-900">
        What this place offers
      </h2>

      {amenities.length === 0 ? (
        <p className="mt-4 text-gray-500">No amenities listed.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {amenities.map((amenity) => (
            <div
              key={amenity.id}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4"
            >
              <span className="text-2xl">{amenity.icon || "✨"}</span>
              <span className="font-medium text-gray-800">{amenity.name}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
