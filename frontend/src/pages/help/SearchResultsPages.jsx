import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; // 1. Added Lucide icons for the arrows
import { fetchSearchResults } from "../../api/helpCenter"; 

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 2. Extract both the query and the page number ('p') from the URL
  const query = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("p")) || 1;
  
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination Settings
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadResults = async () => {
      const data = await fetchSearchResults(query);
      if (isMounted) {
        setResults(data);
        setIsLoading(false);
      }
    };

    if (query) {
      loadResults();
    } else {
      setResults([]);
      setIsLoading(false);
    }

    return () => { isMounted = false; };
  }, [query]);

  // --- PAGINATION MATH ---
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);

  // Smooth scroll to top and update the URL when a page button is clicked
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === '...') return;
    setSearchParams({ q: query, p: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Airbnb's dynamic number generator (handles the "..." ellipsis)
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className=" max-w-[850px] px-6 py-10 md:px-10 lg:px-30 text-[#222222] min-h-[60vh]">
      
      {/* PAGE HEADER */}
      <div className="mb-5">
        <h1 className="text-[32px] md:text-[36px] font-medium tracking-tight text-[#222222] mb-1">
          Search results
        </h1>
        {isLoading ? (
          <p className="text-[16px] text-[#717171]">Searching...</p>
        ) : (
          <p className="text-[16px] text-[#717171]">
            {results.length} {results.length === 1 ? 'match' : 'matches'}
          </p>
        )}
      </div>

      {/* RESULTS LIST */}
      <div className="flex flex-col">
        {isLoading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="border-b border-gray-200 py-8 animate-pulse">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-64 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-full max-w-2xl bg-gray-200 rounded"></div>
            </div>
          ))
        ) : results.length > 0 ? (
          // IMPORTANT: Map over currentItems instead of the full results array!
          currentItems.map((result, index) => (
            <div 
              key={result.id} 
              className={`py-7 flex flex-col justify-start border-b border-gray-200`}
            >
              <p className="text-[14px] text-[#717171] mb-1.5 font-normal">
                {result.tag || result.tab_category || "General Help"}
              </p>
              
              <Link 
                to={`/help/article/${result.id}`} 
                className="text-[18px] font-semibold text-[#222222] underline decoration-1 underline-offset-[3px] mb-2 hover:text-black w-fit"
              >
                {result.title}
              </Link>
              
              <p className="text-[16px] text-[#222222] leading-relaxed line-clamp-2 pr-4 md:pr-12">
                {result.summary || "Click to read more about this topic."}
              </p>
            </div>
          ))
        ) : (
          <div className="py-12 border-t border-gray-200">
            <h3 className="text-xl font-medium mb-2">No results found for "{query}"</h3>
            <p className="text-gray-500">Try adjusting your search terms or browsing our topics.</p>
          </div>
        )}
      </div>

      {/* AIRBNB STYLE PAGINATION CONTROLS */}
      {!isLoading && totalPages > 0 && (
        <div className="mt-12 flex flex-col items-center pt-8 pb-10">
          <div className="flex items-center gap-2">
            
            {/* Previous Button */}
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>

            {/* Dynamic Page Numbers */}
            {getPageNumbers().map((num, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(num)}
                disabled={num === '...'}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-medium transition ${
                  currentPage === num 
                    ? "bg-[#222222] text-white cursor-default" 
                    : num === '...' 
                      ? "cursor-default text-[#222222]" 
                      : "text-[#222222] hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}

            {/* Next Button */}
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* 11-20 of 99 results text */}
          <p className="text-[14px] text-[#717171] mt-5">
            {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, results.length)} of {results.length} results
          </p>
        </div>
      )}

    </div>
  );
}