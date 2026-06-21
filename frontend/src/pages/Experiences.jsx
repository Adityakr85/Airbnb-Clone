import React, { useState, useEffect, useMemo } from "react";
import {useSearchParams } from "react-router-dom";
import { fetchExperiences } from "../api/experiences";
import GlobalCarousel from "../components/GlobalCarousel";
import GlobalCard from "../components/GlobalCard";

export default function Experiences() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const [experienceData, setExperienceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchExperiences({ search: searchQuery });
        if (isMounted) {
          const safeData = Array.isArray(data) ? data : (data?.data || []);
          setExperienceData(safeData);
        }
      } catch (e) {
        if (isMounted) setError(e?.message || "Failed to load experiences");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;};
 }, [searchQuery]);

  const filteredExperiences = useMemo(() => {
    return experienceData.filter((exp) => {
      const loc = exp.location?.toLowerCase() || "";
      const title = exp.title?.toLowerCase() || "";
      return !searchQuery || loc.includes(searchQuery) || title.includes(searchQuery);
    });
  }, [experienceData, searchQuery]);

  const categoryGroups = useMemo(() => {
    if (!searchQuery) return [];
    const groups = filteredExperiences.reduce((acc, exp) => {
      const cat = exp.category ? exp.category.charAt(0).toUpperCase() + exp.category.slice(1) : "Popular activities";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(exp);
      return acc;
    }, {});
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length).slice(0, 2);
  }, [filteredExperiences, searchQuery]);

  const locationGroups = useMemo(() => {
    const groups = experienceData.reduce((acc, exp) => {
      const location = exp.location ? exp.location.split(",")[0].trim() : "Unknown";
      if (!acc[location]) acc[location] = [];
      acc[location].push(exp);
      return acc;
    }, {});
    return Object.entries(groups);
  }, [experienceData]);
  
return loading ? (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Loading experiences...</div>
    </main>
  ) : error ? (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-red-600">{error}</div>
    </main>
  ) : (
    <main className="min-h-screen bg-white px-4 py-8 md:px-10 xl:px-20">
      {experienceData.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-32 text-gray-800">
           <h2 className="mb-2 text-2xl font-semibold">No experiences found</h2>
           <p className="text-gray-500">Your database might be empty, or the connection failed.</p>
         </div>
      ) : searchQuery ? (
        filteredExperiences.length > 0 ? (
          <div className="flex flex-col gap-8">
            {categoryGroups.map(([category, experiences]) => (
              <GlobalCarousel key={category} title={category} items={experiences} routePrefix="experience" />
            ))}
            {/* 2. All Experiences Grid */}
            <section className="mt-4">
              <h2 className="mb-6 text-3xl font-semibold text-gray-900">
                All experiences in {searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                {filteredExperiences.map((exp) => (
                  <GlobalCard key={exp.id} item={exp} routePrefix="experience" />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-gray-800">
            <h2 className="mb-2 text-2xl font-semibold">No exact matches</h2>
            <p className="text-gray-500">Try changing your search destination.</p>
            <a href="/experiences" className="mt-6 rounded-lg border border-black px-6 py-3 font-semibold transition hover:bg-gray-50">
              Clear Search
            </a>
          </div>
        )
      ) : (
        /* Default Home View */
        locationGroups.map(([location, experiences]) => (
          <GlobalCarousel
            key={location} 
            title={`Experiences in ${location}`} 
            items={experiences} 
            routePrefix="experience"
            onTitleClick={() => setSearchParams({ search: location })}
          />
        ))
      )}
    </main>
  );
}
