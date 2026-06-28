import React from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div className="max-w-6xl mx-auto px-8 py-20 text-[#222222]">
      <h1 className="text-3xl font-medium mb-4">Search Results</h1>
      <p className="text-lg text-gray-600">
        You searched for: <span className="font-bold">"{query}"</span>
      </p>
      {/* We can build the actual API fetching grid here later! */}
    </div>
  );
}