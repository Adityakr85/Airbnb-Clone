import { useMemo, useState } from "react";
import {
  Search,
  Send,
  ShieldCheck,
  User,
  Home,
  MessageCircle,
} from "lucide-react";

const conversationsData = [
  {
    id: 1,
    type: "guest",
    name: "Aarav Sharma",
    avatar: "AS",
    listing: "Cozy beach house with stunning views",
    subject: "Question about check-in",
    lastMessage: "Can I check in around 11 AM?",
    time: "10:42 AM",
    unread: true,
    messages: [
      {
        id: 1,
        sender: "guest",
        text: "Hi, I booked your place for this weekend.",
        time: "10:20 AM",
      },
      {
        id: 2,
        sender: "guest",
        text: "Can I check in around 11 AM?",
        time: "10:42 AM",
      },
    ],
  },
  {
    id: 2,
    type: "admin",
    name: "Airbnb Admin",
    avatar: "AD",
    listing: "Luxury villa near city center",
    subject: "Listing verification",
    lastMessage: "Please update your property documents.",
    time: "Yesterday",
    unread: false,
    messages: [
      {
        id: 1,
        sender: "admin",
        text: "Your listing is under review.",
        time: "Yesterday",
      },
      {
        id: 2,
        sender: "admin",
        text: "Please update your property documents.",
        time: "Yesterday",
      },
    ],
  },
];

export default function HostMessages() {
  const [conversations, setConversations] = useState(conversationsData);
  const [activeId, setActiveId] = useState(conversationsData[0]?.id);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.listing.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q)
      );
    });
  }, [conversations, search]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  const handleSend = () => {
    if (!message.trim() || !activeConversation) return;

    const newMessage = {
      id: Date.now(),
      sender: "host",
      text: message.trim(),
      time: "Now",
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessage: message.trim(),
              time: "Now",
              unread: false,
            }
          : c,
      ),
    );

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold text-rose-500">Host inbox</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Chat with guests and receive important updates from admin for each
            listing.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm lg:grid-cols-[360px_1fr]">
          <aside className="border-r border-gray-100">
            <div className="border-b border-gray-100 p-4">
              <div className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-3">
                <Search size={16} className="text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search messages"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="max-h-[650px] overflow-y-auto">
              {filteredConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveId(c.id);
                    setConversations((prev) =>
                      prev.map((item) =>
                        item.id === c.id ? { ...item, unread: false } : item,
                      ),
                    );
                  }}
                  className={`w-full border-b border-gray-50 p-4 text-left transition hover:bg-gray-50 ${
                    activeId === c.id ? "bg-rose-50/60" : "bg-white"
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar type={c.type} avatar={c.avatar} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold text-gray-900">
                          {c.name}
                        </p>
                        <span className="text-xs text-gray-400">{c.time}</span>
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <Home size={12} />
                        <span className="truncate">{c.listing}</span>
                      </div>

                      <p className="mt-2 truncate text-sm font-medium text-gray-700">
                        {c.subject}
                      </p>

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="truncate text-sm text-gray-500">
                          {c.lastMessage}
                        </p>

                        {c.unread && (
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="flex min-h-[650px] flex-col">
            {activeConversation ? (
              <>
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      type={activeConversation.type}
                      avatar={activeConversation.avatar}
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-gray-900">
                          {activeConversation.name}
                        </h2>

                        <TypeBadge type={activeConversation.type} />
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {activeConversation.listing}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 px-6 py-6">
                  {activeConversation.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        m.sender === "host" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-3xl px-5 py-3 shadow-sm ${
                          m.sender === "host"
                            ? "bg-gray-900 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{m.text}</p>
                        <p
                          className={`mt-1 text-[11px] ${
                            m.sender === "host"
                              ? "text-white/60"
                              : "text-gray-400"
                          }`}
                        >
                          {m.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 bg-white p-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                      }}
                      placeholder="Write a message..."
                      className="flex-1 text-sm outline-none placeholder:text-gray-400"
                    />

                    <button
                      onClick={handleSend}
                      disabled={!message.trim()}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF385C] text-white transition hover:bg-[#E31C5F] disabled:bg-gray-300"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center text-gray-400">
                <MessageCircle size={42} className="mb-3 opacity-40" />
                <p className="font-medium">Select a conversation</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function Avatar({ type, avatar }) {
  return (
    <div
      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        type === "admin"
          ? "bg-blue-100 text-blue-600"
          : "bg-rose-100 text-rose-600"
      }`}
    >
      {type === "admin" ? (
        <ShieldCheck size={18} />
      ) : (
        avatar || <User size={18} />
      )}
    </div>
  );
}

function TypeBadge({ type }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        type === "admin"
          ? "bg-blue-100 text-blue-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      {type === "admin" ? "Admin" : "Guest"}
    </span>
  );
}
