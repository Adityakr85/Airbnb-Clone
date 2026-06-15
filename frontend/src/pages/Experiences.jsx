import React, { useEffect, useState, useMemo } from "react";
import { Star, MapPin, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { fetchExperiences } from "../api/experiences";

export default function Experiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchExperiences();
        if (isMounted) setExperiences(data);
      } catch (e) {
        if (isMounted) setError(e?.message || "Failed to load experiences");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    "all",
    "culinary",
    "adventure",
    "culture",
    "wellness",
    "workshops",
    "nature",
  ];

  const filteredExperiences = useMemo(() => {
    return experiences.filter((exp) => {
      const matchesCategory =
        selectedCategory === "all" ||
        exp.category?.toLowerCase().includes(selectedCategory);

      const matchesSearch =
        !searchQuery ||
        exp.location?.toLowerCase().includes(searchQuery) ||
        exp.title?.toLowerCase().includes(searchQuery);

      return matchesCategory && matchesSearch;
    });
  }, [experiences, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading experiences...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-center">
        <div className="px-4">
          <h1 className="text-5xl font-bold text-white mb-4">
            {searchQuery 
              ? `Experiences in "${searchParams.get("search")}"` 
              : "Unique activities hosted by locals"}
          </h1>
          <p className="text-xl text-white/90"></p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-8 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Explore by category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-black text-white"
                    : "bg-white text-black border border-gray-300 hover:border-black"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {filteredExperiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExperiences.map((experience) => (
                <ExperienceCard
                  key={experience.id}
                  experience={experience}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-gray-800">
              <h2 className="text-2xl font-semibold mb-2">No experiences found</h2>
              <p className="text-gray-500">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ExperienceCard({ experience }) {
  const [imageIndex, setImageIndex] = useState(0);

  const images = Array.isArray(experience.images)
    ? experience.images
    : [experience.image || "/placeholder.jpg"];

  const handlePrevImage = (e) => {
    e.preventDefault();
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer group">
      {/* Image Section */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <img
          src={images[imageIndex]}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 transition"
            >
              ‹
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 transition"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full transition ${
                    idx === imageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {experience.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 mb-2 text-sm text-gray-600">
          <MapPin size={16} />
          <span className="line-clamp-1">{experience.location || "Location"}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {experience.description}
        </p>

        {/* Rating */}
        {experience.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">
                {experience.rating.toFixed(1)}
              </span>
              {experience.reviews && (
                <span className="text-gray-500 text-sm">
                  ({experience.reviews})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Host Info */}
        <div className="flex items-center gap-2 mb-4">
          {experience.hostImage && (
            <img
              src={experience.hostImage}
              alt={experience.hostName}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 line-clamp-1">
              Hosted by {experience.hostName || "Local guide"}
            </p>
            {experience.level && (
              <p className="text-xs text-gray-500">{experience.level}</p>
            )}
          </div>
        </div>

        {/* Duration and Guests */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b">
          <span>⏱️ {experience.duration || "2 hours"}</span>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{experience.groupSize || "Up to 8"} guests</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              ${experience.price || "50"}
            </p>
            <p className="text-sm text-gray-500">per person</p>
          </div>
          <button className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}
