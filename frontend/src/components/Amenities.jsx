import amenities from "../data/amenities";

function Amenities() {
  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-2xl font-semibold mb-4">
        What this place offers
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {amenities.map((item) => (
          <div
            key={item.id || item}
            className="border rounded-lg p-3"
          >
            {item.name || item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Amenities;