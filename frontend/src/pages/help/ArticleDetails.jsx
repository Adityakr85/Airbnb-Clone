import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowUp, Check ,Bookmark } from "lucide-react";
import { fetchArticleById } from "../../api/helpCenter"; 

// 1. FALLBACK MOCK DATA
const MOCK_ARTICLE_DATA = {
  id: 3761,
  breadcrumbs: ["Home", "All topics", "Your reservations as a guest", "Changes as a guest", "Changing a reservation"],
  category: "How-to • Guest",
  title: "What to do if you've accidentally made a booking or booked the wrong dates",
  intro: "If you made a mistake when you booked a home, service, or experience—maybe you hit reserve before you checked the details, or you got the right place, but the wrong dates—there are steps you can take to address it.",
  sections: [
    {
      id: "check-policy",
      title: "Check the cancellation policy for your reservation to find out if you'll receive a refund",
      content: `<p class="mb-4">Your host's cancellation policy determines if you're eligible for a refund if you need to cancel. Some bookings allow free cancellations if you act within a certain time frame, so your first step is to check the cancellation policy for your home, service, or experience reservation.</p>
                <p class="mb-4">You can find info about your reservation in the <strong>message thread</strong> with your host, or by checking your <strong>Trips</strong>. The cancellation policy is located under <strong>Reservation details</strong>.</p>
                <p>If you're within the free cancellation window, no problem. You can go ahead and cancel your reservation and make other plans.</p>`
    },
    {
      id: "request-change",
      title: "Request a change to your home reservation",
      content: `<p>If you want to keep your home reservation but need different dates, you can send a <strong>trip change request</strong> to your host. The host decides whether to approve the change. If the dates you need aren't available, try messaging your host—they may be able to adjust their calendar or suggest alternatives.</p>`
    },
    {
      id: "make-changes",
      title: "Make changes to a service or experience reservation",
      content: `<p>If you booked a service or experience, but you made a mistake with the date or time, you may be able to <strong>change your reservation</strong>, depending on your host's availability and their <strong>cancellation policy</strong>.</p>`
    }
  ],
  relatedArticles: [
    { id: 101, category: "How-to • Guest", title: "Change the dates of your home reservation", summary: "Submit a trip change request to your host if you'd like to change the dates of your reservation. If they accept, you'll be charged or refunded, if necessary." },
    { id: 102, category: "How-to • Guest", title: "Find the cancellation policy for any home, service or experience", summary: "Here's where to find the cancellation policy for any home, service or experience." },
  ]
};

export default function ArticleDetails() {
  const { id } = useParams();
  
  // Data States
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cache, setCache] = useState({});
  const [errorStatus, setErrorStatus] = useState(null);

  // UI States
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [feedbackState, setFeedbackState] = useState('initial');
  const [feedbackReasons, setFeedbackReasons] = useState([]);

  // 2. THE SINGLE, COMBINED USE-EFFECT
  useEffect(() => {
    let isMounted = true;

    // A. Fetching Logic
    async function load() {
      if (cache[id]) {
        setArticle(cache[id]);
        setIsLoading(false);
        setErrorStatus(null);
        window.scrollTo(0, 0);
        return;
      }

      setIsLoading(true);
      setErrorStatus(null);
      setFeedbackState('initial');
      setFeedbackReasons([]);

      try {
        const data = await fetchArticleById(id);
        if (isMounted) {
          if (data) {
            setCache(prev => ({ ...prev, [id]: data }));
            setArticle(data);
          } else {
            throw new Error("Article not found in database.");
          }
        }
      } catch (e) {
        if (isMounted) {
          console.warn(e.message);
          setErrorStatus(e.status); 
          setArticle(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          window.scrollTo(0, 0);
        }
      }
    }

    load();

    // B. Scroll Listener Logic
    const handleScroll = () => {
      if (isMounted) setShowBackToTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);

    // C. Single Cleanup Function
    return () => { 
      isMounted = false; 
      window.removeEventListener("scroll", handleScroll);
    };
  }, [id, cache]);

  // 3. HELPER FUNCTIONS
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleReasonToggle = (reason) => {
    setFeedbackReasons(prev => 
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const submitFeedback = (status) => {
    setFeedbackState(status);
    if (status === 'yes' || status === 'submitted') {
      console.log("Ready to send to Laravel:", {
        article_id: id,
        is_helpful: status === 'yes',
        reasons: status === 'submitted' ? feedbackReasons : []
      });
    }
  };

  return (
    <div className="mx-auto max-w-[1040px] px-4 lg:px-0 py-8 text-[#222222] min-h-[60vh]">
      {/* 2. SKELETON LOADER (Matches HelpTopic.jsx design) */}
      {isLoading ? (
        <div className="animate-pulse w-full">
          <div className="mb-8 h-4 w-64 bg-gray-200 rounded"></div>
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex-1">
              <div className="h-10 w-3/4 bg-gray-200 rounded mb-6"></div>
              <div className="h-20 w-full bg-gray-100 rounded mb-10"></div>
              <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-4 w-full bg-gray-100 rounded"></div>)}
              </div>
            </div>
            <div className="w-full lg:w-[320px] h-64 bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      ) : (
        /* 3. THE REAL / FALLBACK DATA RENDER */
        <div className="transition-opacity duration-300 opacity-100">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-[13px] text-gray-800 whitespace-nowrap overflow-x-auto scrollbar-hide w-full">
            {article.breadcrumbs?.map((crumb, index) => {
              const isLast = index === article.breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.id || index}>
                  {isLast ? (
                    <span className="text-gray-900 font-medium max-w-[200px] md:max-w-[400px] truncate select-none">
                      {crumb.label || crumb}
                    </span>
                  ) : (
                    <Link to={crumb.url || "#"} className="hover:underline">
                      {crumb.label || crumb}
                    </Link>
                  )}
                  
                  {!isLast && (
                    <ChevronRight size={14} className="text-gray-700 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <div className="flex flex-col lg:flex-row gap-16 relative">
            {/* Main Content */}
            <div className="flex-1 lg:max-w-[70%]">
              <p className="text-[15px] text-gray-700 mb-2">{article.tag || article.tab_category}</p>
              <h1 className="text-[25px] md:text-[35px] font-medium  mb-6">{article.title}</h1>
              <p className="text-[18px] leading-relaxed mb-8">{article.intro}</p>

              {/* In this article */}
              {article.sections?.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-[16px] font-medium mb-4">In this article</h3>
                  <ul className="flex flex-col gap-3">
                    {article.sections.map((section) => (
                      <li key={section.id} className="flex items-start gap-2">
                        <Bookmark 
                          size={16} 
                          fill="#222222" 
                          strokeWidth={0} 
                          className="shrink-0 mt-1 text-gray-700" 
                        />
                        <a href={`#${section.id}`} onClick={(e) => scrollToSection(e, section.id)} className="text-[16px] font-medium underline underline-offset-2 hover:text-gray-600 transition">
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dynamic Content Sections */}
              <div className="flex flex-col gap-10">
                {article.sections?.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-24">
                    <h2 className="text-[22px] font-medium mb-4">{section.title}</h2>
                    <div 
                      className="text-[16px] leading-relaxed text-[#222222]"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                ))}
              </div>

              {/* Article Feedback Form */}
              <div className="mt-12 py-16 border-b border-gray-200">
                {feedbackState === 'initial' && (
                  <div className="flex items-center gap-4">
                    <span className="text-[16px] font-medium text-[#222222]">Did this article help?</span>
                    <button onClick={() => submitFeedback('yes')} className="text-[16px] font-medium underline cursor-pointer hover:text-gray-600 ">Yes</button>
                    <button onClick={() => setFeedbackState('no')} className="text-[16px] font-medium underline cursor-pointer hover:text-gray-600">No</button>
                  </div>
                )}

                {feedbackState === 'no' && (
                  <div className="flex flex-col animate-in fade-in duration-300">
                    <h3 className="text-[18px] font-medium text-[#222222] mb-1">Tell us a little more.</h3>
                    <p className="text-[16px] text-[#717171] mb-6">Please select all that apply.</p>

                    <div className="flex flex-col gap-4 mb-6">
                      {[
                        "I didn't find the answer to my question",
                        "This info is confusing or unclear",
                        "These instructions didn't work",
                        "Something else"
                      ].map(reason => (
                        <div 
                          key={reason} 
                          onClick={() => handleReasonToggle(reason)}
                          className="flex items-center gap-4 cursor-pointer group"
                        > 
                          <div className={`w-[22px] h-[22px] rounded border flex items-center justify-center transition-colors ${
                            feedbackReasons.includes(reason) ? 'bg-[#222222] border-[#222222] text-white' : 'border-[#b0b0b0] group-hover:border-black bg-white'
                          }`}>
                            {feedbackReasons.includes(reason) && <Check size={14} strokeWidth={4} />}
                          </div>
                          
                          {/* 3. Added 'select-none' so double-clicking doesn't highlight the text */}
                          <span className="text-[16px] text-[#222222] select-none">{reason}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => submitFeedback('submitted')}
                      disabled={feedbackReasons.length === 0}
                      className={`w-fit rounded-lg px-6 py-3 text-[14px] font-medium transition ${
                        feedbackReasons.length > 0 ? 'bg-[#222222] text-white hover:bg-black' : 'bg-[#f7f7f7] text-[#dddddd] cursor-not-allowed'
                      }`}
                    >
                      Submit
                    </button>
                  </div>
                )}

                {(feedbackState === 'yes' || feedbackState === 'submitted') && (
                  <p className="text-[16px] font-medium text-[#222222]">Thanks for your feedback!</p>
                )}
              </div>

              {/* Related Articles */}
              {article.relatedArticles?.length > 0 && (
                <div className="mt-8 pt-8 border-b border-gray-200">
                  <h2 className="text-[22px] font-medium mb-4">Related articles</h2>
                  <div className="flex flex-col gap-4">
                    {article.relatedArticles.map((rel) => (
                      <div key={rel.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <p className="text-[14px] text-[#717171] mb-1">{rel.tag || rel.tab_category}</p>
                        <Link to={`/help/article/${rel.id}`} className="text-[16px] font-medium underline decoration-1 underline-offset-2 hover:text-gray-700 block mb-1">
                          {rel.title}
                        </Link>
                        <p className="text-[14px] text-gray-600 line-clamp-2">{rel.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="hidden lg:block w-[250px] shrink-0">
              <div className="flex flex-col">
                <h3 className="text-[22px] font-medium mb-3 text-[#222222]">
                  Need to get in touch?
                </h3>
                <p className="text-[16px] text-[#222222] mb-6 leading-relaxed">
                  We'll start with some questions and get you to the right place.
                </p>
                <Link 
                  to="/pages/User/Messages" 
                  className="w-fit rounded-xl bg-gray-100 px-6 py-3 text-[16px] font-semibold text-[#222222] transition hover:bg-gray-200 mb-6 block text-center"
                >
                  Contact us
                </Link>
                <p className="text-[16px] text-[#222222]">
                  You can also <Link to="/feedback" className="underline decoration-1 underline-offset-[3px] hover:text-gray-700">give us feedback</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ADD THIS BACK IN: BACK TO TOP BUTTON */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 cursor-pointer flex items-center gap-2 rounded-full bg-[#222222] px-4 py-3 text-[14px] font-medium text-white shadow-md transition-all duration-300 hover:scale-105 ${
          showBackToTop ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <ArrowUp size={16} strokeWidth={2.5} />
        Back to top
      </button>

    </div>
  );
}