import React, { useState , useEffect, useRef} from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Search, Settings, MessageSquare, ChevronDown, Briefcase, AirVent,
  Archive, Send, X, ChevronRight, ArrowUp, Shield, ArrowLeft, MoreHorizontal
} from "lucide-react";
import { fetchInbox, fetchThreadHistory, sendMessage } from "../../api/messages";
import { useEcho } from "../../api/echo";

const Logo = ({ className }) => (
   <img 
    src="/Stayfinder-1.png" 
    alt="Stay Finder Icon" 
    className={`h-8 w-8 object-contain brightness-0 invert opacity-90 ${className || ""}`} 
  />
);

const fallbackInbox = [
  {
    partner_id: "support-123",
    partner_name: "stay finder Support",
    partner_avatar: "A",
    last_message: "What's going on?",
    unread: true,
    type: "support",
    is_closed: false
  },
  {
    partner_id: "host-456",
    partner_name: "Goa Host",
    partner_avatar: "G",
    last_message: "Host accepted your booking request.",
    unread: false,
    type: "travelling"
  }
];

const fallbackChats = {
  "support-123": [
    { id: 1, body: "Hi Aditya, I'm an AI assistant...", is_mine: false, created_at: new Date().toISOString() },
    { id: 2, body: "What's going on?", is_mine: true, created_at: new Date().toISOString() }
  ],
  "host-456": [
    { id: 1, body: "Host accepted your booking request.", is_mine: false, created_at: new Date().toISOString() }
  ]
};

const formatMessageDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function Messages() {
  const { user } = useUser(); 
  const clerk_id = user?.id;
  const echo = useEcho();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. URL IS THE SINGLE SOURCE OF TRUTH
  const activeThreadId = searchParams.get("partner_id") || null;
  const activeThreadRef = useRef(activeThreadId);
  useEffect(() => { activeThreadRef.current = activeThreadId; }, [activeThreadId]);
// 2. STATE MANAGEMENT
  const [inboxThreads, setInboxThreads] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoadingInbox, setIsLoadingInbox] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  // Sidebar & Modal States
  const [filter, setFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [bugReport, setBugReport] = useState(false);
  const [toast, setToast] = useState("");

  const messagesEndRef = useRef(null);
  const scrollToBottom = (behavior = "smooth") => {
  messagesEndRef.current?.scrollIntoView({ behavior });
  };
  useEffect(() => {
  const timer = setTimeout(() => {
    scrollToBottom("smooth");
  }, 50);
  
  return () => clearTimeout(timer);
  }, [chatHistory, activeThreadId]);

  const activeThread = inboxThreads.find(t => String(t.partner_id) === String(activeThreadId));
  
  const filteredThreads = inboxThreads.filter((thread) => {
    const threadType = thread.type ? thread.type.toLowerCase() : "general";
    const matchesFilter =
      filter === "All" ||
      (filter === "Unread" && thread.unread) ||
      threadType === filter.toLowerCase();
    const matchesSearch =
      (thread.partner_name || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (thread.last_message || "").toLowerCase().includes(searchText.toLowerCase());
    if (filter === "Archived") return false;
    return matchesFilter && matchesSearch;
  });

  //Fetch Inbox on Load & Handle Default Open
  useEffect(() => {
    if (!clerk_id) return;
    let isMounted = true;

    const loadInbox = async () => {
      try {
        const data = await fetchInbox(clerk_id);
        if (!isMounted) return;
        setInboxThreads(data);
      } catch (error) {
        if (!isMounted) return;
        console.warn("Using fallback inbox data due to:", error.message);
        setInboxThreads(fallbackInbox);
      } finally {
        if (isMounted) setIsLoadingInbox(false);
      }
    };
    loadInbox();
    return () => { isMounted = false; };
  }, [clerk_id])

  // Real-Time WebSocket Listener
  useEffect(() => {
    if (!clerk_id || !echo) return;

    const channelName = `chat.${clerk_id}`;
    const channel = echo.private(channelName)
      .listen('MessageSent', (e) => {
        console.log("New message received via WebSocket!", e);
        const incomingMessage = {
          id: e.id,
          body: e.body,
          is_mine: false,
          created_at: e.created_at,
        };

        if (String(activeThreadRef.current) === String(e.sender_id)) {
          setChatHistory(prev => [...prev, incomingMessage]);
          setTimeout(scrollToBottom, 100);
        }
        setInboxThreads(prev => {
          const threadExists = prev.find(t => String(t.partner_id) === String(e.sender_id));
          if (threadExists) {
            const filtered = prev.filter(t => String(t.partner_id) !== String(e.sender_id));
            return [{ 
              ...threadExists, 
              last_message: e.body, 
              unread: String(activeThreadRef.current) !== String(e.sender_id) 
            }, ...filtered];
          }
          return prev;
        });
      });
    return () => { echo.leave(channelName); };
  }, [clerk_id, echo]);

// 1. SIMPLE CLICK HANDLER: Clicking a sidebar thread ONLY updates the URL!
  const loadChatHistory = (partnerId) => {
    const targetThread = inboxThreads.find((t) => String(t.partner_id) === String(partnerId));
    const targetName = targetThread ? targetThread.partner_name : "User";
    
    // Push the new chat to the URL. The Master Loader effect below will catch it and load the messages!
    setSearchParams({ partner_id: partnerId, name: targetName });
  };

  // 2. INITIAL AUTO-OPEN: Runs exactly ONCE when the inbox finishes loading
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (isLoadingInbox || inboxThreads.length === 0) return;
    
    // If we already did our initial check on page load, STOP here so we never override user clicks!
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Read the URL on initial load
    const currentId = searchParams.get("partner_id") || searchParams.get("host_id") || searchParams.get("id");
    
    // If the URL is completely empty (/Messages), cleanly auto-open Support using { replace: true }
    if (!currentId) {
      const supportThread = inboxThreads.find(
        (t) => t.type === "support" || 
               String(t.partner_id) === "support-123" || 
               (t.partner_name && t.partner_name.toLowerCase().includes("support"))
      ) || inboxThreads[0];

      if (supportThread) {
        setSearchParams({ partner_id: supportThread.partner_id, name: supportThread.partner_name }, { replace: true });
      }
    }
  }, [isLoadingInbox, inboxThreads]); 

  // 3. MASTER CHAT LOADER: Whenever the address bar URL changes, fetch that chat!
  useEffect(() => {
    const targetPartnerId = searchParams.get("partner_id") || searchParams.get("host_id") || searchParams.get("id");
    if (!targetPartnerId || !clerk_id) return;

    // Mark thread as read in sidebar preview
    setInboxThreads(prev => prev.map(thread => 
      String(thread.partner_id) === String(targetPartnerId) ? { ...thread, unread: false } : thread
    ));

    // Fetch messages from Laravel backend
    let isMounted = true;
    fetchThreadHistory(targetPartnerId, clerk_id)
      .then(data => {
        if (isMounted) {
          setChatHistory(data);
          setTimeout(() => scrollToBottom("auto"), 10);
        }
      })
      .catch(error => {
        console.error("Failed to load chat:", error.message);
        if (isMounted) setChatHistory(fallbackChats[targetPartnerId] || []);
      });

    return () => { isMounted = false; };
  }, [searchParams, clerk_id]); 

// HANDLERS
  const handleSelectThread = (thread) => {
    setSearchParams({ partner_id: thread.partner_id, name: thread.partner_name });
  };
  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeThreadId) return;
    const currentText = messageText;
    setMessageText(""); 

    const tempMessage = {
      id: Date.now(),
      body: currentText,
      is_mine: true,
      created_at: new Date().toISOString(),
    };
    setChatHistory(prev => [...prev, tempMessage]);
    setTimeout(scrollToBottom, 50);

    try {
      await sendMessage({
        clerk_id: clerk_id,
        receiver_id: activeThreadId,
        body: currentText,
        type: "general"
      });
    } catch (error) {
      console.error("Send error:", error.message);
    }
  };

    const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) return;
    const newNotification = {
      id: Date.now(),
      title: "Feedback submitted",
      message: "Thanks for the valuable feedback. Your feedback has been submitted successfully.",
      date: new Date().toLocaleString(),
      type: bugReport ? "Bug report" : "Feedback",
    };

    const oldNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    localStorage.setItem("notifications", JSON.stringify([newNotification, ...oldNotifications]));
    
    setShowFeedback(false);
    setFeedbackText("");
    setBugReport(false);
    setToast("Feedback has been submitted. Thanks for the valuable feedback.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="flex flex-row h-[calc(100dvh-82px)] max-h-[calc(100dvh-82px)] w-full overflow-hidden border-t border-gray-200 bg-white">
      {/* 1. LEFT PANE: Sidebar & Filters */}
      <aside className={`flex flex-col h-full border-r border-gray-200 shrink-0 w-full md:w-[375px] overflow-hidden ${activeThreadId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 pb-4 shrink-0">
          {!searchOpen ? (
            filter === "Archived" ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setFilter("All")} className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100 -ml-2">
                    <ArrowLeft size={20} className="text-gray-800" />
                  </button>
                  <h1 className="text-[22px] font-medium text-gray-900">Archived</h1>
                </div>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
                >
                  <Search size={18} className="text-gray-900" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-medium text-gray-900">Messages</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
                  >
                    <Search size={18} className="text-gray-900" />
                  </button>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
                  >
                    <Settings size={18} className="text-gray-900" />
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex h-10 flex-1 items-center gap-2 rounded-full border-2 border-[#222] px-4">
                <Search size={18} />
                <input
                  autoFocus
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search all messages"
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchText("");
                }}
                className="text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          )}

          {!searchOpen && (
            <div className="relative mt-6 flex gap-2">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white"
              >
                {filter} <ChevronDown size={14} />
              </button>

              <button
                onClick={() =>
                  setFilter(filter === "Unread" ? "All" : "Unread")
                }
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition hover:border-black ${
                  filter === "Unread"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-300 text-gray-900"
                }`}
              >
                Unread
              </button>

              {filterOpen && (
                <div className="absolute left-0 top-10 w-[240px] z-30 rounded-2xl bg-white p-2 shadow-xl border border-gray-100">
                  <button
                    onClick={() => {
                      setFilter("All");
                      setFilterOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100"
                  >
                    <MessageSquare size={18} /> All
                  </button>
                  <button
                    onClick={() => {
                      setFilter("Travelling");
                      setFilterOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100"
                  >
                    <Briefcase size={18} /> Travelling
                  </button>
                  <button
                    onClick={() => {
                      setFilter("Support");
                      setFilterOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100"
                  >
                    <AirVent size={18} /> Support
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {isLoadingInbox ? (
             <div className="pt-10 text-center text-gray-500">Loading messages...</div>
          ) : filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <div
                key={thread.partner_id}
                onClick={() => loadChatHistory(thread.partner_id)}
                className={`flex cursor-pointer items-start gap-4 rounded-xl p-3 transition ${
                  activeThreadId === thread.partner_id ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white font-medium">
                  <Logo className="h-6 w-6" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className={`truncate ${thread.unread ? "font-medium text-gray-900" : "font-medium text-gray-900"}`}>
                      {thread.partner_name}
                    </h3>
                  </div>
                  <p className={`truncate text-sm ${thread.unread ? "font-medium text-gray-900" : "text-gray-600"}`}>
                    {thread.last_message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="pt-24 text-center px-4">
              <MessageSquare className="mx-auto mb-4 text-gray-800" size={32} strokeWidth={1.5} />
              <h2 className="text-[16px] font-medium text-gray-900">You don't have any messages</h2>
              <p className="mt-1 text-[14px] text-gray-500">
                When you receive a new message, it will appear here.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MIDDLE PANE: Chat History & Input */}
      <main className={`flex flex-1 flex-col h-full overflow-hidden bg-white ${!activeThreadId ? 'hidden md:flex' : 'flex'}`}>
        {!activeThreadId ? (
           // CONDITION 1: Completely blank white screen when no chat is active
           <div className="flex-1 bg-white"></div>
        ) : (
          <>
            {/* MIDDLE PANE HEADER */}
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 px-4 md:px-6">
              <div className="flex items-center gap-2 md:gap-0">
                <button 
                  onClick={() => {
                    setSearchParams({}, { replace: true });
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 md:hidden"
                >
                  <ArrowLeft size={20} className="text-gray-900" />
                </button>

                <div className="flex cursor-pointer items-center gap-3 rounded-lg py-2 pr-2 transition hover:bg-gray-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white font-medium">
                    <Logo className="h-6 w-6" />
                  </div>
                  <h2 className="text-[16px] font-medium text-gray-900">{activeThread?.partner_name}</h2>
                  <ChevronRight size={20} className="text-gray-900 hidden md:block" />
                </div>
              </div>

              {!isDetailsOpen && (
                <button onClick={() => setIsDetailsOpen(true)} className="flex h-7 items-center justify-center rounded-full border border-gray-200 bg-gray-100 px-4 text-[13px] font-medium text-gray-700">
                  Show details
                </button>
              )}
            </div>

            {/* CHAT BUBBLES */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
              {chatHistory.map((msg, index) => {
                // Determine if we need a new date divider
                const msgDate = new Date(msg.created_at).toDateString();
                const prevMsgDate = index > 0 ? new Date(chatHistory[index - 1].created_at).toDateString() : null;
                const showDate = msgDate !== prevMsgDate;

                return (
                  <React.Fragment key={msg.id}>
                    {/* Dynamic Date Divider */}
                    {showDate && (
                      <div className="text-center text-[12px] font-medium text-gray-500 mt-2 mb-2">
                        {formatMessageDate(msg.created_at)}
                      </div>
                    )}
                    
                    <div className={`flex w-full ${msg.is_mine ? "justify-end" : "justify-start"}`}>
                      <div className={`flex max-w-[85%] md:max-w-[75%] items-end gap-2 ${msg.is_mine ? "flex-row-reverse" : "flex-row"}`}>
                        
                        {!msg.is_mine && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[12px] font-medium text-white mb-1">
                            {activeThread?.partner_name === "stay finder Support" ? <Logo className="h-3.5 w-3.5" /> : activeThread?.partner_avatar}
                          </div>
                        )}

                        <div className="flex flex-col">
                          {!msg.is_mine && (
                            <span className="mb-1 ml-1 text-[12px] font-medium text-gray-500">
                              {activeThread?.partner_name === "stay finder Support" ? "AI Assistant" : activeThread?.partner_name} {new Date(msg.created_at).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'}).toLowerCase()}
                            </span>
                          )}

                          <div className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                            msg.is_mine ? "bg-[#f1f1f1] text-gray-700 rounded-br-sm" : "bg-[#f1f1f1] text-gray-700 rounded-bl-sm"
                          }`}>
                            {msg.body}
                          </div>
                        </div>

                        {msg.is_mine && (
                          <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 mb-1">
                            <MoreHorizontal size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* CONDITION 3: INPUT OR CLOSED FOOTER */}
            {activeThread?.is_closed && activeThread?.type !== "support" ? (
              <footer className="shrink-0 border-t border-gray-200 bg-white px-6 py-5 flex justify-center">
                <p className="text-[14px] text-gray-500">
                  This conversation is closed due to inactivity. Still need help? {" "}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setInboxThreads(prev => prev.map(t => 
                        t.partner_id === activeThreadId ? { ...t, is_closed: false } : t
                      ));
                    }} 
                    className="font-medium text-gray-900 underline"
                  >
                    Contact us
                  </button>
                </p>
              </footer>
            ) : (
              <footer className="shrink-0 border-t border-gray-200 bg-white px-4 md:px-6 py-4">
                <div className="relative flex rounded-2xl border border-gray-400 bg-white p-1 focus-within:border-gray-700 focus-within:ring-1 focus-within:ring-black transition-all duration-200">
                  <textarea
                    placeholder="Write a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="h-[52px] w-full resize-none rounded-xl px-4 py-3.5 text-[15px] text-gray-900 outline-none placeholder:text-gray-500"
                  />
                  <button
                    disabled={!messageText.trim()}
                    onClick={handleSendMessage}
                    className={`absolute bottom-2.5 right-3 flex h-8 w-8 items-center justify-center rounded-full transition duration-200 ${
                      messageText.trim() ? "bg-gray-900 text-white hover:bg-black hover:scale-105" : "cursor-not-allowed bg-gray-100 text-gray-400"
                    }`}
                  >
                    <ArrowUp size={18} strokeWidth={3} />
                  </button>
                </div>
              </footer>
            )}
          </>
        )}
      </main>

      {/* 3. RIGHT PANE: Details */}
      {isDetailsOpen && (
        <aside className="hidden lg:flex w-[350px] shrink-0 flex-col h-full overflow-hidden border-l border-gray-200 bg-white">
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 px-6">
            <h2 className="text-[18px] font-medium text-gray-800">Details</h2>
            <button 
              onClick={() => setIsDetailsOpen(false)} 
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
            >
              <X size={18} className="text-gray-900" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {activeThread && (
              <div className="px-6 pt-6">
                <div className="flex items-start gap-4 border-b border-gray-200 pb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white font-medium">
                    <Logo className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col pt-0.5">
                    <h3 className="text-[16px] font-medium text-gray-900">{activeThread.partner_name}</h3>
                    <p className="mt-1 text-[14px] leading-snug text-gray-600">
                      {activeThread.property_title || "Get help from a member of our team."}
                    </p>
                  </div>
                </div>
                
              </div>
            )}
          </div>
        </aside>
      )}

      {/* MODALS */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-3xl bg-white p-7">
            <div className="mb-6 flex justify-between">
              <div />
              <h2 className="font-medium">Messaging settings</h2>
              <button onClick={() => setSettingsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <button
              onClick={() => {
                setFilter("Archived");
                setSettingsOpen(false);
              }}
              className="flex w-full items-center gap-4 py-4 text-lg hover:bg-gray-50"
            >
              <Archive size={22} /> Archived
            </button>
            <button
              onClick={() => {
                setSettingsOpen(false);
                setShowFeedback(true);
              }}
              className="flex w-full items-center gap-4 py-4 text-lg hover:bg-gray-50"
            >
              <Send size={22} /> Give feedback
            </button>
          </div>
        </div>
      )}

      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[520px] overflow-hidden rounded-3xl bg-white">
            <div className="p-7">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowFeedback(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-medium">Tell us about it</h2>
              <p className="mt-2 text-gray-500">
                Share your experience with us. What's working well? What
                could've gone better?
              </p>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="mt-5 h-32 w-full rounded-lg border border-gray-400 p-3 outline-none"
              />
              <label className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={bugReport}
                  onChange={(e) => setBugReport(e.target.checked)}
                  className="h-5 w-5"
                />
                <span>I'm reporting a bug</span>
              </label>
            </div>
            <div className="flex justify-end border-t border-gray-200 p-5">
              <button
                disabled={!feedbackText.trim()}
                onClick={handleSubmitFeedback}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition ${feedbackText.trim() ? "bg-[#222] text-white hover:bg-black" : "cursor-not-allowed bg-gray-100 text-gray-400"}`}
              >
                Submit <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] rounded-xl bg-[#222] px-5 py-4 text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
