import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function getImageUrl(image) {
  if (!image) return "/placeholder.jpg";

  if (typeof image === "object") {
    image = image.url || image.image_path || "";
  }

  if (typeof image !== "string" || !image.trim()) return "/placeholder.jpg";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/storage/")) {
    return `${API_BASE}${image}`;
  }

  if (image.startsWith("storage/")) {
    return `${API_BASE}/${image}`;
  }

  return `${API_BASE}/storage/${image}`;
}

export default function ImageGallery({ images = [] }) {
  const safeImages = images?.length
    ? images.map(getImageUrl)
    : ["/placeholder.jpg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = safeImages[activeIndex];

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <section className="space-y-4">
        <div className="group relative overflow-hidden rounded-3xl bg-gray-100">
          <img
            src={activeImage}
            alt="Property"
            onClick={() => setLightboxOpen(true)}
            className="h-auto max-h-[560px] w-full cursor-pointer object-cover object-center transition duration-500"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />

          <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white">
            {activeIndex + 1} / {safeImages.length}
          </div>

          {safeImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-105 group-hover:flex"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-105 group-hover:flex"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {safeImages.length > 1 && (
          <div className="flex justify-center gap-2">
            {safeImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? "w-6 bg-[#FF385C]" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {safeImages.length > 1 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {safeImages.slice(1, 5).map((image, index) => {
              const realIndex = index + 1;

              return (
                <button
                  key={realIndex}
                  onClick={() => setActiveIndex(realIndex)}
                  className={`overflow-hidden rounded-2xl border-2 bg-gray-100 transition ${
                    activeIndex === realIndex
                      ? "border-[#FF385C]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Property ${realIndex + 1}`}
                    className="aspect-[4/3] w-full object-cover object-center transition duration-300 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </section>

      {lightboxOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-6">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>

          {safeImages.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <img
            src={activeImage}
            alt="Property"
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />

          {safeImages.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronRight size={28} />
            </button>
          )}

          <div className="absolute bottom-6 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            {activeIndex + 1} / {safeImages.length}
          </div>
        </div>
      )}
    </>
  );
}
