export default function AmenitiesStep({
  form,
  set,
  amenities,
  amenitiesLoading,
}) {
  const toggleAmenity = (amenityId) => {
    const exists = form.amenities.includes(amenityId);

    set(
      "amenities",
      exists
        ? form.amenities.filter((id) => id !== amenityId)
        : [...form.amenities, amenityId],
    );
  };

  return (
    <div className="flex-1 flex flex-col items-center px-8 py-10 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
        Tell guests what your place has to offer
      </h1>

      <p className="text-gray-500 text-sm mb-8 self-start">
        You can add more amenities after you publish your listing.
      </p>

      {amenitiesLoading ? (
        <p className="text-gray-500">Loading amenities...</p>
      ) : amenities.length === 0 ? (
        <p className="text-gray-500">No amenities found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 w-full">
          {amenities.map((amenity) => {
            const amenityId = Number(amenity.id);
            const name = amenity.name || amenity.label || amenity.title;
            const icon = amenity.icon || "✨";
            const selected = form.amenities.includes(amenityId);

            return (
              <button
                key={amenityId || name}
                type="button"
                onClick={() => toggleAmenity(amenityId)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition text-left hover:border-gray-400 ${
                  selected ? "border-gray-900 bg-gray-50" : "border-gray-200"
                }`}
              >
                <span className="text-2xl">{icon}</span>

                <span className="text-sm font-medium text-gray-800">
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
