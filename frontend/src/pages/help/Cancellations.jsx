import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { fetchTopicCategory } from "../../api/helpCenter";

// 1. HARDCODED AIRBNB DATA (Zero database required)
const FALLBACK_TOPIC_DATA = {
  breadcrumbs: [
    { id: 1, label: "Home", url: "/help" },
    { id: 2, label: "All topics", url: "/help/topics" },
    { id: 3, label: "Your reservations as a home host", url: "/help/hosting" },
    { id: 4, label: "Cancellations", url: "/help/cancellations" },
  ],
  pageTitle: "Cancellations",
  pageSummary: "Cancelling a reservation; Host-initiated cancellations; Cancellation policies",
  // NEW: Articles are now grouped by Section Headings
  sections: [
    {
      id: "sec-1",
      title: "Cancelling a reservation",
      articles: [
        {
          id: 101,
          tag: "How-to • Guest",
          title: "Cancel your home reservation as a guest",
          summary: "You can cancel or make changes to your home reservation in your trips.",
          url: "/help/article/101"
        },
        {
          id: 102,
          tag: "How-to • Guest",
          title: "Cancelling a reservation paid for using Klarna",
          summary: "Even if you have a Klarna payment plan, you can still cancel your reservation on Airbnb.",
          url: "/help/article/102"
        },
        {
          id: 103,
          tag: "How-to • Guest",
          title: "Cancel or withdraw a trip request",
          summary: "As long as your pending trip request hasn't been accepted, you can cancel the reservation through the message thread with your host.",
          url: "/help/article/103"
        }
      ]
    }
  ],
  relatedTopics: [
    { id: 201, title: "Reservation status", url: "/help/topic/201" },
    { id: 202, title: "Changes as a guest", url: "/help/topic/202" },
    { id: 203, title: "Checking in", url: "/help/topic/203" },
    { id: 204, title: "Checking out", url: "/help/topic/204" },
    { id: 205, title: "Preparing for an Airbnb Experience", url: "/help/topic/205" },
    { id: 206, title: "Issues with your reservation", url: "/help/topic/206" }
  ]
};

export default function HelpTopic() {
  const {id } = useParams(); 
  
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchTopicCategory(id || "1367");
        if (isMounted) {
          setCmsData(data);
        }
      } catch (e) {
        if (isMounted) {
          setCmsData(FALLBACK_TOPIC_DATA);
          setError(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => { isMounted = false; };
  }, [id]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-20">
      
      {/* DECOUPLED ERROR BANNER */}
      {error && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-[15px] font-medium flex items-center gap-2 w-full">
          <span className="text-lg leading-none">⚠️</span> {error}
        </div>
      )}

      {loading || !cmsData ? (
        /* =========================================
           THE SKELETON LOADER (Matches exact layout)
           ========================================= */
        <div className="animate-pulse w-full">
          {/* Fake Breadcrumbs */}
          <div className="mb-8 flex gap-2">
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-800 rounded"></div>
          </div>

          <div className="flex flex-col gap-16 lg:flex-row lg:gap-16">
            <div className="flex-1 ">
              {/* Left Column Skeletons */}
              <div className="h-10 w-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-5 w-full max-w-md bg-gray-100 rounded mb-12"></div>
              
              <div className="flex flex-col gap-12">
                {[1, 2, 3, 4].map((sectionIndex) => (
                  <div key={sectionIndex}>
                    <div className="h-7 w-56 bg-gray-200 rounded mb-6"></div>
                    <div className="flex flex-col">
                      {[1, 2, 3].map((item, index) => (
                        <div key={item} className={`flex flex-col py-6 ${index !== 0 ? "border-t border-gray-200" : "pt-0"}`}>
                          <div className="h-3 w-24 bg-gray-200 rounded mb-3"></div>
                          <div className="h-6 w-3/4 bg-gray-300 rounded mb-3"></div>
                          <div className="h-4 w-full bg-gray-100 rounded mb-1"></div>
                          <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column Skeletons */}
            <div className="w-full shrink-0 lg:w-[350px]">
              <div className="h-7 w-40 bg-gray-200 rounded mb-6"></div>
              <div className="flex flex-col gap-5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="h-4 w-full bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================
           THE REAL / FALLBACK DATA RENDER
           ========================================= */
        <div className="w-full transition-opacity duration-300 opacity-100">
          
          {/* Breadcrumbs */}
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-gray-800">
            {cmsData.breadcrumbs?.map((crumb, index) => (
              <React.Fragment key={crumb.id || index}>
                <Link to={crumb.url} className="hover:underline">
                  {crumb.label}
                </Link>
                {index < cmsData.breadcrumbs.length - 1 && (
                  <ChevronRight size={14} className="text-gray-500" />
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Main Layout Grid */}
          <div className="flex flex-col gap-16 lg:flex-row lg:gap-16">
            
            {/* Left Column: Title & Articles */}
            <div className="flex-1 ">
              <h1 className="mb-1 text-[34px] md:text-[40px] font-medium tracking-tight text-[#222222]">
                {cmsData.pageTitle}
              </h1>

              {cmsData.pageSummary && (
                <p className="mb-12 text-[16px] text-gray-[500] font-small">
                  {cmsData.pageSummary}
                </p>
              )}

              <div className="flex flex-col gap-12">
                {cmsData.sections?.map((section) => (
                  <div key={section.id || section.title}>
                    
                    <h2 className="mb-6 text-[24px] font-medium text-[#222222]">
                      {section.title}
                    </h2>
                    
                    <div className="flex flex-col">
                      {section.articles?.map((article, index) => (
                        <div 
                          key={article.id} 
                          className={`flex flex-col py-6 ${
                            index !== 0 ? "border-t border-gray-200" : "pt-0"
                          }`}
                        >
                          <span className="mb-1 text-[13px] text-gray-600">
                            {article.tag}
                          </span>
                          
                          <Link 
                            to={article.url} 
                            className="mb-1.5 text-[18px] font-medium text-gray-800 underline decoration-1 underline-offset-[3px] hover:text-black leading-snug w-fit"
                          >
                            {article.title}
                          </Link>
                          
                          <p className="text-[16px] leading-relaxed text-gray-400">
                            {article.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="w-full shrink-0 lg:w-[350px]">
              <h2 className="mb-8 text-[22px] font-medium text-gray-900">
                Related topics
              </h2>
              
              <ul className="flex flex-col gap-3">
                {cmsData.relatedTopics?.map((topic) => (
                  <li key={topic.id}>
                    <Link 
                      to={topic.url} 
                      className="text-[15px] text-gray-500 underline transition hover:text-gray-700"
                    >
                      {topic.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}