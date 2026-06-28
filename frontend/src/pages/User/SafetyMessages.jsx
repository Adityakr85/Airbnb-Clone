import React, { useState } from "react";
import { Search, Settings, ChevronRight, X, ArrowUp, Shield } from "lucide-react";

export default function SafetyMessages() {
  const [messageText, setMessageText] = useState("");

  return (
    // Height calculation assumes your navbar is 80px tall (h-20). Adjust if needed.
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden border-t border-gray-200 bg-white">
      
      {/* 1. LEFT PANE: Message List */}
      <div className="flex w-[375px] shrink-0 flex-col border-r border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <div className="flex gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
              <Search size={18} className="text-gray-900" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
              <Settings size={18} className="text-gray-900" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 px-6 pb-4">
          <button className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white">
            All <span className="ml-1 text-xs">v</span>
          </button>
          <button className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-900 transition hover:border-black">
            Unread
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {/* Active Conversation Item */}
          <div className="flex cursor-pointer items-start gap-4 bg-gray-100/60 p-4 mx-2 rounded-2xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#222222] text-white">
              <Shield size={24} fill="currentColor" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Airbnb Support</h3>
                <span className="text-xs text-gray-500">3:03 pm</span>
              </div>
              <p className="truncate text-sm text-gray-600">Otherwise, can you tell me a littl...</p>
              <p className="mt-0.5 text-sm text-gray-500">Ongoing</p>
            </div>
          </div>
          
          {/* Inactive Conversation Item Example */}
          <div className="flex cursor-pointer items-start gap-4 p-4 mx-2 rounded-2xl transition hover:bg-gray-50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#222222] text-white">
              <Shield size={24} fill="currentColor" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Airbnb Support</h3>
                <span className="text-xs text-gray-500">2:06 pm</span>
              </div>
              <p className="truncate text-sm text-gray-600">Otherwise, can you tell me a littl...</p>
              <p className="mt-0.5 text-sm text-gray-500">Ongoing</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE PANE: Chat History & Input */}
      <div className="flex flex-1 flex-col relative">
        {/* Chat Header */}
        <div className="flex h-[72px] items-center border-b border-gray-200 px-6">
          <div className="flex items-center gap-3 cursor-pointer rounded-lg p-2 transition hover:bg-gray-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#222222] text-white">
              <Shield size={16} fill="currentColor" />
            </div>
            <h2 className="font-semibold text-gray-900">Airbnb Support</h2>
            <ChevronRight size={18} className="text-gray-500" />
          </div>
        </div>

        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          
          {/* Bot Message 1 */}
          <div className="mb-6 flex max-w-[80%] items-start gap-3">
             <div className="flex rounded-2xl bg-[#f7f7f7] p-4 text-[#222222] text-[15px] leading-relaxed border border-gray-200 shadow-sm">
              Hi Aditya, I'm an AI assistant who can get you help for your safety issue. I might not always get things right, so if you want to talk to a person instead, just ask.
            </div>
          </div>

          {/* Bot Message 2 */}
          <div className="mb-6 flex max-w-[80%] items-start gap-3">
             <div className="flex flex-col gap-3 rounded-2xl bg-[#f7f7f7] p-4 text-[#222222] text-[15px] leading-relaxed border border-gray-200 shadow-sm">
              <p>If there's an emergency in progress, contact emergency services.</p>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-3 px-4 font-semibold text-gray-900 transition hover:bg-gray-200 border border-gray-300">
                 📞 Call emergency services
              </button>
            </div>
          </div>

          {/* Bot Message 3 */}
          <div className="mb-6 flex max-w-[80%] items-end gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#222222] text-white mb-2">
              <Shield size={14} fill="currentColor" />
            </div>
             <div className="flex rounded-2xl bg-[#f7f7f7] p-4 text-[#222222] text-[15px] leading-relaxed border border-gray-200 shadow-sm">
              Otherwise, can you tell me a little about what's going on so I can get you the right kind of help?
            </div>
          </div>

        </div>

        {/* Input Area (Pinned to bottom) */}
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
                messageText.trim() ? "bg-[#E31C5F] text-white hover:bg-[#D70466]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ArrowUp size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. RIGHT PANE: Details */}
      <div className="hidden w-[350px] shrink-0 flex-col border-l border-gray-200 lg:flex">
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
      </div>

    </div>
  );
}