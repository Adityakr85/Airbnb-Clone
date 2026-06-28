import React, { useState, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

function getSafeImageArray(item) {
  let extractedImages = [];

  if (Array.isArray(item.images)) extractedImages = item.images;
  else if (Array.isArray(item.image_urls)) extractedImages = item.image_urls;
  else if (typeof item.images === "string") {
    try { extractedImages = JSON.parse(item.images); } 
    catch { extractedImages = [item.images]; }
  } 
  else if (typeof item.image_urls === "string") {
    try { extractedImages = JSON.parse(item.image_urls); } 
    catch { extractedImages = [item.image_urls]; }
  }
  else if (item.image) extractedImages = [item.image];

  const cleanImages = extractedImages.filter(img => typeof img === "string" && img.trim() !== "");
  return cleanImages.length > 0 ? cleanImages : ["/placeholder.jpg"];
}

export default function GlobalCard({ 
  item, 
  routePrefix, 
  showRating = true,
  showWishlist = true,
  showBadge = true
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());

  const images = getSafeImageArray(item);
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    const checkWishlist = () => {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const uniqueId = item.id; // Using exact original property logic
      setIsWishlisted(savedWishlist.includes(uniqueId));
    };

    checkWishlist();
    window.addEventListener("wishlistUpdated", checkWishlist);
    return () => window.removeEventListener("wishlistUpdated", checkWishlist);
  }, [item.id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const uniqueId = item.id;

    const updatedWishlist = savedWishlist.includes(uniqueId)
      ? savedWishlist.filter((id) => id !== uniqueId)
      : [...savedWishlist, uniqueId];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const safePrice = item.price ?? item.price_per_night ?? item.base_price ?? 0;
  const displayPrice = safePrice.toString().includes('₹') || safePrice.toString().includes('$') 
    ? safePrice 
    : `₹${safePrice.toLocaleString("en-IN")}`;

  return (
    <Link to={`/${routePrefix}/${item.id}`} className="group block w-full cursor-pointer">
      
      {/* 1. Changed to aspect-square and rounded-xl to match Airbnb's exact card shape */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
        
        {!imageErrors.has(images[imageIndex]) ? (
          <img
            src={images[imageIndex]}
            alt={item.title || "Item"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => {
              setImageErrors((prev) => new Set(prev).add(images[imageIndex]));
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
            Image Unavailable
          </div>
        )}
        {showBadge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-[#222222] shadow-sm">
            Guest favourite
          </span>
        )}

        {showWishlist && (
          <button 
            onClick={toggleWishlist}
            className="absolute right-3 top-3 z-10 drop-shadow-md transition hover:scale-110"
          >
            <Heart 
              size={24} 
              strokeWidth={1.5}
              fill={isWishlisted ? "#FF385C" : "rgba(0,0,0,0.3)"} 
              color={isWishlisted ? "#FF385C" : "white"} 
            />
          </button>
        )}

        {hasMultipleImages && (
          <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition hover:scale-105 hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition hover:scale-105 hover:bg-white"
            >
              <ChevronRight size={16} />
            </button>
            
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-[6px] rounded-full transition-all ${
                    idx === imageIndex ? "w-[6px] bg-white" : "w-[6px] bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Text layout perfectly matching the screenshot */}
      <div className="mt-3 flex flex-col">
        <h3 className="truncate text-[15px] font-semibold text-[#222222]">
          {item.title}
        </h3>
        {item.type === "article" ? (
          <span className="mt-0.5 text-[14px] text-[#717171]">Official Guide</span>
        ) : (
          <div className="mt-0.5 flex items-center text-[15px] text-[#717171]">
            <span className="text-[#222222]">{displayPrice}</span>
            <span className="ml-1">for 1 night</span>
          
            {showRating && item.rating && (
              <>
                <span className="mx-1.5">·</span>
                <span className="flex items-center gap-1 text-[#222222]">
                  <Star size={12} className="fill-current text-[#222222]" />
                  {item.rating}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}