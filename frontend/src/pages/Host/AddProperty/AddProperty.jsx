import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useHost } from "../HostContext";

import IntroStep from "./steps/01IntroStep";
import CategoryStep from "./steps/02CategoryStep";
import LocationStep from "./steps/03LocationStep";
import BasicsStep from "./steps/04BasicsStep";
import StandOutStep from "./steps/05StandOutStep";
import AmenitiesStep from "./steps/06AmenitiesStep";
import PhotosStep from "./steps/07PhotosStep";
import TitleDescriptionStep from "./steps/08TitleDescriptionStep";
import PriceStep from "./steps/09PriceStep";
import SuccessStep from "./steps/SuccessStep";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const TOTAL_STEPS = 9;

function imageUrl(path) {
  if (!path) return "";
  if (typeof path === "object") path = path.url || path.image_path || "";
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/storage/")) return `${API_BASE}${path}`;
  if (path.startsWith("storage/")) return `${API_BASE}/${path}`;
  return `${API_BASE}/storage/${path}`;
}

export default function AddProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { user } = useUser();
  const { addProperty } = useHost();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [amenities, setAmenities] = useState([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);

  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    latitude: 23.3441,
    longitude: 85.3096,
    price: "",
    category_id: "",
    guests: 0,
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    image: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchAmenities();
  }, []);

  useEffect(() => {
    if (isEdit && user?.id) {
      fetchPropertyForEdit();
    }
  }, [isEdit, id, user?.id]);

  const fetchPropertyForEdit = async () => {
    try {
      setLoadingEdit(true);

      const res = await fetch(`${API_BASE}/api/properties/${id}`, {
        headers: { Accept: "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to load property");
      }

      const property = result.data;

      const existingImages =
        property.image_urls?.length > 0
          ? property.image_urls
          : property.images?.length > 0
            ? property.images
            : property.image
              ? [property.image]
              : [];

      const previewImages = existingImages.map(imageUrl).filter(Boolean);

      setForm({
        title: property.title || "",
        description: property.description || "",
        location: property.location || "",
        address: property.address || "",
        latitude: property.latitude || 23.3441,
        longitude: property.longitude || 85.3096,
        price: property.price || "",
        category_id: property.category_id ? String(property.category_id) : "",
        guests: property.guests || 1,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        amenities: Array.isArray(property.amenities)
          ? property.amenities.map((a) => a.id)
          : [],
        image: previewImages[0] || "",
      });

      setImagePreviews(previewImages);
      setImageFiles([]);
    } catch (error) {
      console.error(error);
      toast.error("Could not load property details");
    } finally {
      setLoadingEdit(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      const res = await fetch(`${API_BASE}/api/categories/property`, {
        headers: { Accept: "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch categories");
      }

      setCategories(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Could not load property categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchAmenities = async () => {
    try {
      setAmenitiesLoading(true);

      const res = await fetch(`${API_BASE}/api/amenities`, {
        headers: { Accept: "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch amenities");
      }

      setAmenities(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Could not load amenities");
    } finally {
      setAmenitiesLoading(false);
    }
  };

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const next = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));

  const back = () => {
    if (step === 1) navigate("/host/properties");
    else setStep((prev) => prev - 1);
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      location: "",
      address: "",
      latitude: 23.3441,
      longitude: 85.3096,
      price: "",
      category_id: "",
      guests: 0,
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
      image: "",
    });

    setImagePreviews([]);
    setImageFiles([]);
    setStep(1);
  };

  const handleSubmit = async () => {
    try {
      if (!user?.id) return toast.error("Please login first");
      if (!form.category_id)
        return toast.error("Please select property category");
      if (!form.location.trim()) return toast.error("Please add city/location");
      if (!form.address.trim())
        return toast.error("Please add complete address");
      if (!form.title.trim()) return toast.error("Please add property title");

      if (!isEdit && imageFiles.length === 0) {
        return toast.error("Please upload at least one photo");
      }

      if (isEdit && imagePreviews.length === 0 && imageFiles.length === 0) {
        return toast.error("Please keep or upload at least one photo");
      }

      const data = new FormData();

      if (isEdit) data.append("_method", "PUT");

      data.append("clerk_id", user.id);
      data.append("title", form.title);
      data.append("description", form.description || "");
      data.append("location", form.location);
      data.append("address", form.address);
      data.append("latitude", form.latitude);
      data.append("longitude", form.longitude);
      data.append("price", Number(form.price) || 2299);
      data.append("category_id", form.category_id);
      data.append("guests", form.guests || 1);
      data.append("bedrooms", form.bedrooms || 0);
      data.append("bathrooms", form.bathrooms || 0);

      form.amenities.forEach((amenityId) => {
        data.append("amenities[]", amenityId);
      });

      imageFiles.forEach((file) => {
        data.append("images[]", file);
      });

      const url = isEdit
        ? `${API_BASE}/api/properties/${id}`
        : `${API_BASE}/api/properties`;

      const res = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        console.log(result);
        throw new Error(
          result.message ||
            (isEdit
              ? "Failed to update property"
              : "Failed to create property"),
        );
      }

      if (!isEdit) addProperty(result.data);

      toast.success(
        isEdit ? "Property updated successfully!" : "Your listing is live!",
      );

      if (isEdit) {
        navigate("/host/properties");
      } else {
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.message ||
          (isEdit ? "Could not update listing" : "Could not publish listing"),
      );
    }
  };

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <IntroStep isEdit={isEdit} />;

      case 2:
        return (
          <CategoryStep
            form={form}
            set={set}
            categories={categories}
            categoriesLoading={categoriesLoading}
          />
        );

      case 3:
        return <LocationStep form={form} setForm={setForm} />;

      case 4:
        return <BasicsStep form={form} set={set} />;

      case 5:
        return <StandOutStep isEdit={isEdit} />;

      case 6:
        return (
          <AmenitiesStep
            form={form}
            set={set}
            amenities={amenities}
            amenitiesLoading={amenitiesLoading}
          />
        );

      case 7:
        return (
          <PhotosStep
            form={form}
            set={set}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            imagePreviews={imagePreviews}
            setImagePreviews={setImagePreviews}
          />
        );

      case 8:
        return <TitleDescriptionStep form={form} set={set} />;

      case 9:
        return <PriceStep form={form} set={set} />;

      default:
        return null;
    }
  };

  if (loadingEdit) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center bg-white">
        <p className="text-lg font-semibold text-gray-700">
          Loading listing details...
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <SuccessStep
        onViewListings={() => navigate("/host/properties")}
        onAddAnother={() => {
          setSubmitted(false);
          resetForm();
        }}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] bg-white flex flex-col overflow-hidden">
      <div className="h-1 bg-gray-200 flex-shrink-0">
        <div
          className="h-1 bg-gray-900 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto">{renderStep()}</div>

      <div className="border-t border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0 bg-white">
        <button
          type="button"
          onClick={back}
          className="text-sm font-semibold text-gray-700 underline hover:text-gray-900 transition"
        >
          Back
        </button>

        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i + 1 === step ? "w-4 h-2 bg-gray-900" : "w-2 h-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={next}
            disabled={step === 2 && !form.category_id}
            className="bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-semibold text-sm transition"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#FF385C] hover:bg-[#E31C5F] text-white px-8 py-3 rounded-lg font-semibold text-sm transition"
          >
            {isEdit ? "Update Listing" : "Publish Listing"}
          </button>
        )}
      </div>
    </div>
  );
}
