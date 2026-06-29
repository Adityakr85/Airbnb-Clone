import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; 
import { fetchArticleById } from "../../api/helpCenter"; 

export default function ArticleDetails() {
  const { id } = useParams(); 
  
  // Mirroring PropertyDetails state structure exactly:
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error("Failed to load article:", err);
        setError("We couldn't find the help article you were looking for.");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id]);

  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-lg font-medium text-[#717171]">
        Loading article documentation...
      </div>
    );
  }

  // 2. ERROR / 404 STATE
  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <h2 className="text-2xl font-bold text-[#222222] mb-2">Article Not Found</h2>
        <p className="text-[#717171] mb-6 max-w-md">{error}</p>
        <Link 
          to="/help" 
          className="px-6 py-2.5 rounded-lg bg-[#222222] text-white font-semibold text-[15px] hover:bg-black transition"
        >
          Return to Help Centre
        </Link>
      </div>
    );
  }

  // 3. SUCCESS STATE
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-[#222222]">
      
      {/* THE AIRBNB BREADCRUMB TRAIL */}
      <nav className="flex items-center gap-2 text-[14px] text-[#717171] mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide select-none">
        {article.breadcrumbs && article.breadcrumbs.map((step, index) => (
          <React.Fragment key={index}>
            <Link to={step.url} className="hover:underline hover:text-black transition">
              {step.label}
            </Link>
            <span className="text-[12px] font-bold">›</span>
          </React.Fragment>
        ))}
        
        <span className="text-[#222222] font-medium truncate max-w-[200px] sm:max-w-none">
          {article.title}
        </span>
      </nav>

      {/* Headline */}
      <h1 className="text-[32px] sm:text-[38px] font-bold tracking-tight mb-6 leading-tight">
        {article.title}
      </h1>

      {/* Article Body */}
      <div 
        className="prose max-w-none text-[16px] leading-relaxed text-[#222222]"
        dangerouslySetInnerHTML={{ __html: article.body_content }} 
      />

    </div>
  );
}