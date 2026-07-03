import { MapPin, Star } from "lucide-react";

export default function PropertyHeader({ property }) {
  return (
    <section className="mb-6">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
        {property.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-700">
        <span className="flex items-center gap-1 font-medium">
          <Star size={16} className="fill-current" />
          {property.rating || "New"}
        </span>

        <span>·</span>

        <span className="flex items-center gap-1 underline">
          <MapPin size={16} />
          {property.location}
        </span>

        {property.category?.name && (
          <>
            <span>·</span>
            <span>
              {property.category.icon} {property.category.name}
            </span>
          </>
        )}
      </div>

      {property.address && (
        <p className="mt-2 text-sm text-gray-500">{property.address}</p>
      )}
    </section>
  );
}
