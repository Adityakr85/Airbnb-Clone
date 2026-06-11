import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

import ProfileSidebar from "./ProfileSidebar";
import AboutTab from "./AboutTab";
import PastTripsTab from "./PastTripsTab";
import ConnectionsTab from "./ConnectionsTab";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("about");
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div className="p-10">Loading...</div>;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-white">
      <div className="flex min-h-[calc(100vh-80px)]">
        <ProfileSidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <section className="flex-1 p-10">
          {activeTab === "about" && <AboutTab user={user} />}
          {activeTab === "trips" && <PastTripsTab />}
          {activeTab === "connections" && <ConnectionsTab />}
        </section>
      </div>
    </main>
  );
}
