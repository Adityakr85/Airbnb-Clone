import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GlobalCard from "./GlobalCard";

export default function GlobalCarousel({ 
  title, 
  items, 
  routePrefix, 
  onTitleClick,
  showRating = true 
}) {
  const scrollRef = useRef(null);

  // Handles the smooth scrolling math
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // If there's no data, don't draw an empty section
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        
        {/* Clickable Title Section */}
        <div 
          onClick={onTitleClick}
          className={`group flex items-center gap-1 ${onTitleClick ? "cursor-pointer" : "cursor-default"}`}
        >
          <h1 className="text-2xl font-small tracking-tight text-gray-900">
            {title}
          </h1>
          {/* Only show the chevron arrow if the title is actually clickable */}
          {onTitleClick && (
            <button className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 transition group-hover:bg-gray-200 cursor-pointer : cursor-default">
              <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Desktop Carousel Controls */}
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => scroll("left")}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:scale-105 hover:shadow-md cursor-pointer : cursor-default"
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:scale-105 hover:shadow-md cursor-pointer : cursor-default"
          >
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* The Scrolling Container */}
      <div
        ref={scrollRef}
        className="scrollbar-hide -mx-3 flex scroll-smooth overflow-x-auto pb-6"
      >
        {items.map((item) => (
          <div key={item.id} className="w-[200px] shrink-0 px-2 lg:w-[220px]">
            <GlobalCard 
              item={item} 
              routePrefix={routePrefix} 
              showRating={showRating} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}