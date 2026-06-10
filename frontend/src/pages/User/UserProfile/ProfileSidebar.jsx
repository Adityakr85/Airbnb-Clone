export default function ProfileSidebar({ user, activeTab, setActiveTab }) {
  const name = user?.firstName || user?.fullName || "User";

  const tabs = [
    {
      id: "about",
      label: "About me",
      image: user?.imageUrl,
    },
    {
      id: "trips",
      label: "Past trips",
      icon: "🧳",
    },
    {
      id: "connections",
      label: "Connections",
      icon: "👥",
    },
  ];

  return (
    <aside className="w-96 border-r border-gray-200 p-10">
      <h1 className="mb-8 text-3xl font-semibold">Profile</h1>

      <div className="space-y-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex w-full items-center gap-5 rounded-2xl p-4 text-left font-semibold transition ${
              activeTab === tab.id ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            {tab.image ? (
              <img
                src={tab.image}
                alt={name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl">{tab.icon}</span>
            )}

            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
