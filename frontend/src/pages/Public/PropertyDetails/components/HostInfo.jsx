// src/pages/Public/PropertyDetails/components/HostInfo.jsx
import { Bath, BedDouble, Users } from "lucide-react";

export default function HostInfo({ property }) {
  const host = property.host;

  return (
    <section className="border-b border-gray-200 pb-8">
      <div className="flex items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Hosted by {host?.name || "Host"}
          </h2>

          <p className="mt-2 text-gray-600">
            {property.guests} guests · {property.bedrooms} bedrooms ·{" "}
            {property.bathrooms} bathrooms
          </p>
        </div>

        <img
          src={host?.image || host?.profile_image || "/placeholder-avatar.png"}
          alt={host?.name || "Host"}
          className="h-16 w-16 rounded-full object-cover border"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoCard
          icon={<Users size={22} />}
          label="Guests"
          value={property.guests}
        />
        <InfoCard
          icon={<BedDouble size={22} />}
          label="Bedrooms"
          value={property.bedrooms}
        />
        <InfoCard
          icon={<Bath size={22} />}
          label="Bathrooms"
          value={property.bathrooms}
        />
      </div>
    </section>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="text-gray-700">{icon}</div>
      <p className="mt-3 text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
