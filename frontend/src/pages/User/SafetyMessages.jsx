import React, { useState } from "react";
import {
  Search,
  Settings,
  MessageSquare,
  ChevronDown,
  Briefcase,
  AirVent,
  Archive,
  Send,
  X,
  ChevronRight,
  ArrowUp,
  Shield
} from "lucide-react";

// Mock Data
const initialMessages = [
  {
    id: 1,
    type: "Support",
    title: "Airbnb Support",
    text: "Otherwise, can you tell me a littl...",
    time: "3:03 pm",
    unread: true,
  },
  {
    id: 2,
    type: "Travelling",
    title: "Goa Host",
    text: "Host accepted your booking request.",
    time: "Yesterday",
    unread: false,
  },
];

export default function UnifiedMessages() {
  // Sidebar State (From Messages.jsx)
  const [filter, setFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [bugReport, setBugReport] = useState(false);
  const [toast, setToast] = useState("");

  // Chat State (From SafetyMessages.jsx)
  const [messageText, setMessageText] = useState("");

  // Filtering Logic
  const filteredMessages = initialMessages.filter((msg) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Unread" && msg.unread) ||
      msg.type === filter;

    const matchesSearch =
      msg.title.toLowerCase().includes(searchText.toLowerCase()) ||
      msg.text.toLowerCase().includes(searchText.toLowerCase()) ||
      msg.type.toLowerCase().includes(searchText.toLowerCase());

    if (filter === "Archived") return false;
    return matchesFilter && matchesSearch;
  });

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) return;
    setShowFeedback(false);
    setFeedbackText("");
    setBugReport(false);
    setToast("Feedback has been submitted. Thanks for the valuable feedback.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden border-t border-gray-200 bg-white">
      
      {/* 1. LEFT PANE: Sidebar & Filters */}
      <aside className="flex w-[375px] shrink-0 flex-col border-r border-gray-200">
        <div className="p-6 pb-4">
          {!searchOpen ? (
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
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
                onClick={() => setFilter(filter === "Unread" ? "All" : "Unread")}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition hover:border-black ${
                  filter === "Unread" ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-900"
                }`}
              >
                Unread
              </button>

              {filterOpen && (
                <div className="absolute left-0 top-10 w-[240px] z-30 rounded-2xl bg-white p-2 shadow-xl border border-gray-100">
                  <button onClick={() => { setFilter("All"); setFilterOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100">
                    <MessageSquare size={18} /> All
                  </button>
                  <button onClick={() => { setFilter("Travelling"); setFilterOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100">
                    <Briefcase size={18} /> Travelling
                  </button>
                  <button onClick={() => { setFilter("Support"); setFilterOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100">
                    <AirVent size={18} /> Support
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div key={msg.id} className="flex cursor-pointer items-start gap-4 rounded-2xl p-3 transition hover:bg-gray-50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#222222] text-white">
                  <Shield size={24} fill="currentColor" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className={`truncate ${msg.unread ? "font-bold text-gray-900" : "font-semibold text-gray-900"}`}>{msg.title}</h3>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className={`truncate text-sm ${msg.unread ? "font-medium text-gray-900" : "text-gray-600"}`}>{msg.text}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{msg.type}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="pt-16 text-center">
              <MessageSquare className="mx-auto mb-3 text-gray-400" size={32} />
              <h2 className="font-semibold text-gray-900">No messages found</h2>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search.</p>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MIDDLE PANE: Chat History & Input */}
      <main className="flex flex-1 flex-col relative">
        <div className="flex h-[72px] items-center border-b border-gray-200 px-6">
          <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-gray-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#222222] text-white">
              <Shield size={16} fill="currentColor" />
            </div>
            <h2 className="font-semibold text-gray-900">Airbnb Support</h2>
            <ChevronRight size={18} className="text-gray-500" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-32">
          <div className="mb-6 flex max-w-[80%] items-start gap-3">
             <div className="flex rounded-2xl border border-gray-200 bg-[#f7f7f7] p-4 text-[15px] leading-relaxed text-[#222222] shadow-sm">
              Hi there, I'm an AI assistant who can get you help for your safety issue. If you want to talk to a person instead, just ask.
            </div>
          </div>
          <div className="mb-6 flex max-w-[80%] items-start gap-3">
             <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-[#f7f7f7] p-4 text-[15px] leading-relaxed text-[#222222] shadow-sm">
              <p>If there's an emergency in progress, contact emergency services.</p>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 font-semibold text-gray-900 transition hover:bg-gray-200">
                 📞 Call emergency services
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full bg-white px-6 pb-6 pt-2">
          <div className="relative flex rounded-2xl border border-gray-400 bg-white p-1 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
            <textarea
              placeholder="Write a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="h-24 w-full resize-none rounded-xl p-3 text-gray-900 outline-none placeholder:text-gray-500"
            />
            <button 
              disabled={!messageText.trim()}
              className={`absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition ${
                messageText.trim() ? "bg-[#E31C5F] text-white hover:bg-[#D70466]" : "cursor-not-allowed bg-gray-100 text-gray-400"
              }`}
            >
              <ArrowUp size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </main>

      {/* 3. RIGHT PANE: Details */}
      <aside className="hidden w-[350px] shrink-0 flex-col border-l border-gray-200 lg:flex">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-gray-900">Details</h2>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
            <X size={18} className="text-gray-900" />
          </button>
        </div>
        <div className="border-b border-gray-200 px-6 pb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#222222] text-white">
              <Shield size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Airbnb Support</h3>
              <p className="mt-1 text-sm text-gray-600">Get help from a member of our team.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MODALS */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-3xl bg-white p-7">
            <div className="mb-6 flex justify-between">
              <div />
              <h2 className="font-semibold">Messaging settings</h2>
              <button onClick={() => setSettingsOpen(false)}><X size={20} /></button>
            </div>
            <button onClick={() => { setFilter("Archived"); setSettingsOpen(false); }} className="flex w-full items-center gap-4 py-4 text-lg hover:bg-gray-50">
              <Archive size={22} /> Archived
            </button>
            <button onClick={() => { setSettingsOpen(false); setShowFeedback(true); }} className="flex w-full items-center gap-4 py-4 text-lg hover:bg-gray-50">
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
                <button onClick={() => setShowFeedback(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"><X size={20} /></button>
              </div>
              <h2 className="text-2xl font-semibold">Tell us about it</h2>
              <p className="mt-2 text-gray-500">Share your experience with us. What's working well? What could've gone better?</p>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="mt-5 h-32 w-full rounded-lg border border-gray-400 p-3 outline-none"
              />
              <label className="mt-4 flex items-center gap-3">
                <input type="checkbox" checked={bugReport} onChange={(e) => setBugReport(e.target.checked)} className="h-5 w-5" />
                <span>I'm reporting a bug</span>
              </label>
            </div>
            <div className="flex justify-end border-t border-gray-200 p-5">
              <button disabled={!feedbackText.trim()} onClick={handleSubmitFeedback} className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition ${feedbackText.trim() ? "bg-[#222] text-white hover:bg-black" : "cursor-not-allowed bg-gray-100 text-gray-400"}`}>
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