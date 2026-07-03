import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { fetchPropertyById } from "../../../api/properties";

import ImageGallery from "./components/ImageGallery";
import PropertyHeader from "./components/PropertyHeader";
import HostInfo from "./components/HostInfo";
import Amenities from "./components/Amenities";
import Reviews from "./components/Reviews";
import BookingCard from "./components/BookingCard";

export default function PropertyDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultCheckIn = checkInParam ? new Date(checkInParam) : null;
  const defaultCheckOut = checkOutParam ? new Date(checkOutParam) : null;

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        const data = await fetchPropertyById(id);
        setProperty(data);
      } catch (error) {
        console.error("Error loading property:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg font-semibold text-gray-700">
          Loading property details...
        </p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg font-semibold text-gray-700">
          Property not found
        </p>
      </div>
    );
  }

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <PropertyHeader property={property} />

        <ImageGallery images={property.images || property.image_urls || []} />

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          <section>
            <HostInfo property={property} />

            <div className="border-b border-gray-200 py-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                About this place
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-gray-700">
                {property.description || "No description available."}
              </p>
            </div>

            <Amenities amenities={property.amenities || []} />

            <Reviews />
          </section>

          <aside>
            <BookingCard
              property={property}
              defaultCheckIn={defaultCheckIn}
              defaultCheckOut={defaultCheckOut}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
