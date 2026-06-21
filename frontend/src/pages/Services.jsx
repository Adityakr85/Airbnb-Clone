import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchServices } from "../api/services"; 
import GlobalCarousel from "../components/GlobalCarousel";
import GlobalCard from "../components/GlobalCard";

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const typeQuery = searchParams.get("type") || "";

  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchServices({ search: searchQuery, type: typeQuery });
        if (isMounted) {
          const safeData = Array.isArray(data) ? data : (data?.data || []);
          setServiceData(safeData);
        }
      } catch (e) {
        if (isMounted) setError(e?.message || "Failed to load services");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [searchQuery, typeQuery]);

  const filteredServices = useMemo(() => {
    return serviceData.filter((srv) => {
      const loc = srv.location?.toLowerCase() || "";
      const title = srv.title?.toLowerCase() || "";
      const srvType = srv.type || "";

      const matchesSearch = !searchQuery || loc.includes(searchQuery) || title.includes(searchQuery);
      const matchesType = !typeQuery || srvType === typeQuery;

      return matchesSearch && matchesType;
    });
  }, [serviceData, searchQuery, typeQuery]);

const typeGroups = useMemo(() => {
    if (!searchQuery && !typeQuery) return [];
    const groups = filteredServices.reduce((acc, srv) => {
      const t = srv.type ? srv.type.charAt(0).toUpperCase() + srv.type.slice(1) : "Popular services";
      if (!acc[t]) acc[t] = [];
      acc[t].push(srv);
      return acc;
    }, {});
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length).slice(0, 2);
  }, [filteredServices, searchQuery, typeQuery]);

  const locationGroups = useMemo(() => {
    const groups = serviceData.reduce((acc, srv) => {
      const location = srv.location ? srv.location.split(",")[0].trim() : "Unknown";
      if (!acc[location]) acc[location] = [];
      acc[location].push(srv);
      return acc;
    }, {});
    return Object.entries(groups);
  }, [serviceData]);

  const defaultTypeGroups = useMemo(() => {
    const groups = serviceData.reduce((acc, srv) => {
      const type = srv.type ? srv.type : "Other Services";
      
      if (!acc[type]) acc[type] = [];
      acc[type].push(srv);
      return acc;
    }, {});
    
    return Object.entries(groups);
  }, [serviceData]);

  const getHeaderText = () => {
    const count = filteredServices.length;
    const serviceWord = count === 1 ? "service" : "services";
    
    if (typeQuery && searchQuery && searchQuery !== "nearby") {
      return `Explore ${count} ${typeQuery.toLowerCase()} ${serviceWord} in ${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}`;
    } else if (typeQuery) {
      return `Explore ${count} ${typeQuery.toLowerCase()} ${serviceWord}`;
    } else if (searchQuery && searchQuery !== "nearby") {
      return `Explore ${count} ${serviceWord} in ${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}`;
    }
    return `Explore ${count} ${serviceWord}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      
      {loading ? (
        <main className="flex flex-grow items-center justify-center pt-24">
          <div className="text-gray-600">Loading services...</div>
        </main>
      ) : error ? (
        <main className="flex flex-grow items-center justify-center pt-24">
          <div className="text-red-600">{error}</div>
        </main>
      ) : (
        <main className="mx-auto flex-grow w-full max-w-[1440px] px-4 pb-16 pt-32 md:px-10 xl:px-20">
          
          {serviceData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-800">
              <h2 className="mb-2 text-2xl font-semibold">No services found</h2>
              <p className="text-gray-500">Your database might be empty, or the connection failed.</p>
            </div>
          ) : searchQuery || typeQuery ? (
            filteredServices.length > 0 ? (
              <div className="flex flex-col gap-8">
                <div className="mb-2">
                  {/* Dynamic Header */}
                  <h1 className="mb-6 text-2xl font-semibold text-[#222222]">
                  {getHeaderText()}
                  </h1>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-8">
                  {filteredServices.map((srv) => (
                    <GlobalCard key={srv.id} item={srv} routePrefix="service" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-gray-800">
                <h2 className="mb-2 text-2xl font-semibold">No exact matches</h2>
                <p className="text-gray-500">Try changing or removing some of your filters.</p>
                <button 
                  onClick={() => setSearchParams({})} 
                  className="mt-6 cursor-pointer rounded-lg border border-black px-6 py-3 font-medium transition hover:bg-gray-50"
                >
                  Clear Search
                </button>
              </div>
            )
          ) : (
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-8">
                {defaultTypeGroups.map(([type, services]) => (
                  <GlobalCarousel
                    key={type} 
                    title={type} 
                    items={services} 
                    routePrefix="service"
                    onTitleClick={() => setSearchParams({ type: type })}
                  />
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-8">
                <h2 className="text-[28px] font-medium tracking-tight text-[#222222]">
                  Discover services on Airbnb
                </h2>
                
                {locationGroups.map(([location, services]) => (
                  <GlobalCarousel
                    key={location} 
                    title={`Services in ${location}`} 
                    items={services} 
                    routePrefix="service"
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
