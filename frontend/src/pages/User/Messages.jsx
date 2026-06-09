import { useState } from "react";
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
} from "lucide-react";

const messages = [
  {
    id: 1,
    type: "Travelling",
    title: "Your Goa booking is confirmed",
    text: "Host accepted your booking request.",
    unread: true,
  },
  {
    id: 2,
    type: "Support",
    title: "Support case update",
    text: "We reviewed your request.",
    unread: false,
  },
];

export default function Messages() {
  const [filter, setFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [bugReport, setBugReport] = useState(false);
  const [toast, setToast] = useState("");

  const filteredMessages = messages.filter((msg) => {
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

    const newNotification = {
      id: Date.now(),
      title: "Feedback submitted",
      message:
        "Thanks for the valuable feedback. Your feedback has been submitted successfully.",
      date: new Date().toLocaleString(),
      type: bugReport ? "Bug report" : "Feedback",
    };

    const oldNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];

    localStorage.setItem(
      "notifications",
      JSON.stringify([newNotification, ...oldNotifications]),
    );

    setShowFeedback(false);
    setFeedbackText("");
    setBugReport(false);
    setToast("Feedback has been submitted. Thanks for the valuable feedback.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex bg-white">
      <aside className="w-[375px] border-r border-gray-200">
        <div className="p-8">
          {!searchOpen ? (
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Messages</h1>

              <div className="flex gap-3">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <Search size={20} />
                </button>

                <button
                  onClick={() => setSettingsOpen(true)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <Settings size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border-2 border-[#222] rounded-full px-4 h-12 flex-1">
                <Search size={20} />
                <input
                  autoFocus
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search all messages"
                  className="outline-none w-full"
                />
              </div>

              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchText("");
                }}
                className="font-medium"
              >
                Cancel
              </button>
            </div>
          )}

          {!searchOpen && (
            <div className="relative mt-7 flex gap-3">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-[#222] text-white px-5 py-3 rounded-full flex items-center gap-2 font-medium"
              >
                {filter}
                <ChevronDown size={16} />
              </button>

              <button
                onClick={() => setFilter("Unread")}
                className={`px-5 py-3 rounded-full border font-medium ${
                  filter === "Unread"
                    ? "bg-[#222] text-white"
                    : "border-gray-300"
                }`}
              >
                Unread
              </button>

              {filterOpen && (
                <div className="absolute top-14 left-0 w-[360px] bg-white rounded-2xl shadow-xl p-3 z-30">
                  <button
                    onClick={() => {
                      setFilter("All");
                      setFilterOpen(false);
                    }}
                    className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl hover:bg-gray-100"
                  >
                    <MessageSquare size={22} /> All
                  </button>

                  <button
                    onClick={() => {
                      setFilter("Travelling");
                      setFilterOpen(false);
                    }}
                    className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl hover:bg-gray-100"
                  >
                    <Briefcase size={22} /> Travelling
                  </button>

                  <button
                    onClick={() => {
                      setFilter("Support");
                      setFilterOpen(false);
                    }}
                    className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl hover:bg-gray-100"
                  >
                    <AirVent size={22} /> Support
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-8">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="border-b border-gray-200 py-4 cursor-pointer"
              >
                <h3 className="font-semibold">{msg.title}</h3>
                <p className="text-sm text-gray-500">{msg.text}</p>
              </div>
            ))
          ) : (
            <div className="pt-20 text-center">
              <MessageSquare className="mx-auto mb-4" size={36} />
              <h2 className="font-semibold">You don’t have any messages</h2>
              <p className="text-gray-500 mt-2">
                When you receive a new message, it will appear here.
              </p>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1"></main>

      {settingsOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="w-[720px] bg-white rounded-3xl p-7">
            <div className="flex justify-between mb-8">
              <div></div>
              <h2 className="font-semibold">Messaging settings</h2>
              <button onClick={() => setSettingsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <button
              onClick={() => {
                setFilter("Archived");
                setSettingsOpen(false);
              }}
              className="w-full flex items-center gap-5 py-5 text-lg"
            >
              <Archive size={24} /> Archived
            </button>

            <button
              onClick={() => {
                setSettingsOpen(false);
                setShowFeedback(true);
              }}
              className="w-full flex items-center gap-5 py-5 text-lg"
            >
              <Send size={24} /> Give feedback
            </button>
          </div>
        </div>
      )}

      {showFeedback && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="w-[720px] bg-white rounded-3xl overflow-hidden">
            <div className="p-7">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowFeedback(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-3xl font-semibold">Tell us about it</h2>

              <p className="text-gray-500 mt-2 text-lg">
                Share your experience with us. What’s working well? What
                could’ve gone better?
              </p>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="mt-5 w-full h-32 border border-gray-400 rounded-lg p-3 outline-none"
              />

              <label className="flex items-center gap-3 mt-3">
                <input
                  type="checkbox"
                  checked={bugReport}
                  onChange={(e) => setBugReport(e.target.checked)}
                  className="w-5 h-5"
                />
                <span>I’m reporting a bug</span>
              </label>
            </div>

            <div className="border-t p-5 flex justify-end">
              <button
                disabled={!feedbackText.trim()}
                onClick={handleSubmitFeedback}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition ${
                  feedbackText.trim()
                    ? "bg-[#222] text-white hover:bg-black"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
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
