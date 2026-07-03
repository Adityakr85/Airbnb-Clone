import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";

import ImageGallery from "../components/ImageGallery";
import Amenities from "../components/Amenities";
import Reviews from "../components/Reviews";
import HostInfo from "../components/HostInfo";
import BookingCard from "../components/BookingCard";

import { fetchPropertyById } from "../api/properties";
import hosts from "../data/hosts";

function PropertyDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");

  // Parse dates if they exist in URL params
  const [defaultCheckIn, setDefaultCheckIn] = useState(null);
  const [defaultCheckOut, setDefaultCheckOut] = useState(null);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (checkInParam) {
      setDefaultCheckIn(new Date(checkInParam));
    }
    if (checkOutParam) {
      setDefaultCheckOut(new Date(checkOutParam));
    }
  }, [checkInParam, checkOutParam]);

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await fetchPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error("Error loading property:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">
        Property Not Found
      </div>
    );
  }

  const host = property.host || hosts.find((h) => h.id === property.host_id);
  
  const handleContactHost = () => {
    if (!host) return;
    const hostId = host.id || property.host_id || "host-456";
    const hostName = encodeURIComponent(host.name || "Property Host");
    
    navigate(`/pages/User/Messages?partner_id=${hostId}&name=${hostName}`);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Property Title */}
      <h1 className="text-4xl font-bold mb-2">{property.title}</h1>

      {/* Property Info */}
      <p className="text-gray-600 mb-6">
        ⭐ 4.9 · {property.location} · {property.guests} Guests ·{" "}
        {property.bedrooms} Bedrooms · {property.bathrooms} Bathrooms
      </p>

      {/* Image Gallery */}
      <ImageGallery image={property.images?.[0] || "/placeholder.jpg"} />

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        {/* Left Section */}
        <div className="lg:col-span-2">
          {/* Host */}
          {host && (
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex-1">
                <HostInfo host={host} />
              </div>
              
              <button
                onClick={handleContactHost}
                className="ml-4 flex shrink-0 items-center gap-2 rounded-xl border border-black bg-white px-6 py-3 font-semibold text-gray-900 shadow-sm transition duration-200 hover:bg-gray-100 active:scale-95"
              >
                <MessageSquare size={18} />
                Contact Host
              </button>
            </div>
          )}

          {/* About */}
          <div className="border-t border-b py-6 mt-6">
            <h2 className="text-2xl font-semibold mb-3">About this place</h2>

            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <Amenities />

          {/* Reviews */}
          <Reviews />
        </div>

        {/* Right Section */}
        <div>
          <BookingCard
            property={property}
            defaultCheckIn={defaultCheckIn}
            defaultCheckOut={defaultCheckOut}
          />
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
