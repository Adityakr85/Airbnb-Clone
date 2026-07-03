import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapFlyTo({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    if (!latitude || !longitude) return;

    map.flyTo([Number(latitude), Number(longitude)], 16, {
      duration: 0.8,
    });
  }, [latitude, longitude, map]);

  return null;
}

function LocationMarker({ form, updateFromLatLng }) {
  useMapEvents({
    click(e) {
      updateFromLatLng(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={[Number(form.latitude), Number(form.longitude)]}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const pos = e.target.getLatLng();
          updateFromLatLng(pos.lat, pos.lng);
        },
      }}
    />
  );
}

export default function LocationStep({ form, setForm }) {
  const [searchText, setSearchText] = useState(form.address || "");
  const [addressParts, setAddressParts] = useState({
    flat: "",
    landmark: "",
    city: form.location || "",
    state: "",
    country: "India",
    postcode: "",
  });

  const makeFullAddress = (parts) => {
    return [
      parts.flat,
      parts.landmark,
      parts.city,
      parts.state,
      parts.country,
      parts.postcode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const updateAddressParts = (newParts) => {
    const updated = {
      ...addressParts,
      ...newParts,
    };

    setAddressParts(updated);

    setForm((prev) => ({
      ...prev,
      location: updated.city || "",
      address: makeFullAddress(updated),
    }));
  };

  const updateFromLatLng = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );

      const data = await res.json();
      const a = data.address || {};

      const city =
        a.city ||
        a.town ||
        a.village ||
        a.suburb ||
        a.county ||
        a.state_district ||
        "";

      const state = a.state || "";
      const country = a.country || "";
      const postcode = a.postcode || "";

      const landmark =
        a.road ||
        a.neighbourhood ||
        a.suburb ||
        a.hamlet ||
        a.locality ||
        data.name ||
        "";

      const updated = {
        ...addressParts,
        landmark,
        city,
        state,
        country,
        postcode,
      };

      const fullAddress = makeFullAddress(updated);

      setAddressParts(updated);
      setSearchText(data.display_name || fullAddress);

      setForm((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        location: city,
        address: data.display_name || fullAddress,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Could not update address");
    }
  };

  const searchAddress = async () => {
    if (!searchText.trim()) {
      toast.error("Please type an address first");
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          searchText,
        )}&limit=1&addressdetails=1`,
      );

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        toast.error("Location not found");
        return;
      }

      const place = data[0];
      const a = place.address || {};

      const city =
        a.city ||
        a.town ||
        a.village ||
        a.suburb ||
        a.county ||
        a.state_district ||
        "";

      const state = a.state || "";
      const country = a.country || "";
      const postcode = a.postcode || "";

      const landmark =
        a.road ||
        a.neighbourhood ||
        a.suburb ||
        a.hamlet ||
        a.locality ||
        place.name ||
        "";

      const updated = {
        ...addressParts,
        landmark,
        city,
        state,
        country,
        postcode,
      };

      setAddressParts(updated);

      setForm((prev) => ({
        ...prev,
        latitude: Number(place.lat),
        longitude: Number(place.lon),
        location: city,
        address: place.display_name,
      }));

      setSearchText(place.display_name);

      toast.success("Location found");
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch location");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-8 py-10 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
        Where's your place located?
      </h1>

      <p className="text-gray-500 text-sm mb-6 self-start">
        Move the marker or search your address. City will be saved in location,
        and complete address will be saved in address.
      </p>

      <div className="w-full h-80 rounded-2xl mb-5 overflow-hidden border border-gray-200 bg-gray-100">
        <MapContainer
          center={[Number(form.latitude), Number(form.longitude)]}
          zoom={16}
          className="w-full h-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <MapFlyTo latitude={form.latitude} longitude={form.longitude} />

          <LocationMarker form={form} updateFromLatLng={updateFromLatLng} />
        </MapContainer>
      </div>

      <div className="w-full border border-gray-300 rounded-2xl overflow-hidden divide-y divide-gray-200">
        <div className="px-4 py-3 flex items-center justify-between bg-white">
          <div>
            <p className="text-xs text-gray-400">Country/region</p>
            <p className="text-sm font-medium text-gray-800">
              {addressParts.country || "India"}
            </p>
          </div>

          <span className="text-gray-400">∨</span>
        </div>

        <div className="flex">
          <input
            placeholder="Search full address"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-3 text-sm outline-none placeholder-gray-400"
          />

          <button
            type="button"
            onClick={searchAddress}
            className="px-5 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition"
          >
            Search
          </button>
        </div>

        <input
          placeholder="Flat, house, etc. (if applicable)"
          value={addressParts.flat}
          onChange={(e) => updateAddressParts({ flat: e.target.value })}
          className="w-full px-4 py-3 text-sm outline-none placeholder-gray-400"
        />

        <input
          placeholder="Nearby landmark / road / area"
          value={addressParts.landmark}
          onChange={(e) => updateAddressParts({ landmark: e.target.value })}
          className="w-full px-4 py-3 text-sm outline-none placeholder-gray-400"
        />

        <input
          placeholder="City/town"
          value={addressParts.city}
          onChange={(e) => updateAddressParts({ city: e.target.value })}
          className="w-full px-4 py-3 text-sm outline-none placeholder-gray-400"
        />

        <input
          placeholder="State"
          value={addressParts.state}
          onChange={(e) => updateAddressParts({ state: e.target.value })}
          className="w-full px-4 py-3 text-sm outline-none placeholder-gray-400"
        />

        <input
          placeholder="Pincode"
          value={addressParts.postcode}
          onChange={(e) => updateAddressParts({ postcode: e.target.value })}
          className="w-full px-4 py-3 text-sm outline-none placeholder-gray-400"
        />
      </div>

      <div className="w-full mt-4 rounded-2xl bg-gray-50 border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-500 mb-1">
          Saved location
        </p>
        <p className="text-sm text-gray-900">
          {form.location || "City will appear here"}
        </p>

        <p className="text-xs font-semibold text-gray-500 mt-3 mb-1">
          Saved address
        </p>
        <p className="text-sm text-gray-900">
          {form.address || "Complete address will appear here"}
        </p>
      </div>
    </div>
  );
}
