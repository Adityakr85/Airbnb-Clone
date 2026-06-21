import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { getProfile } from "../../../api/profile";

import ProfileSidebar from "./ProfileSidebar";
import AboutTab from "./AboutTab";
import PastTripsTab from "./PastTripsTab";
import ConnectionsTab from "./ConnectionsTab";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("about");
  const { user, isLoaded } = useUser();
  const [backendProfile, setBackendProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from backend
  useEffect(() => {
    async function loadBackendProfile() {
      if (!isLoaded || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfile(user.id);
        if (data) {
          setBackendProfile(data);
        }
      } catch (error) {
        console.warn("Could not load profile from backend:", error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBackendProfile();
  }, [user?.id, isLoaded]);

  if (!isLoaded || loading) return <div className="p-10">Loading...</div>;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-white">
      <div className="flex min-h-[calc(100vh-80px)]">
        <ProfileSidebar
          user={user}
          backendProfile={backendProfile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <section className="flex-1 p-10">
          {activeTab === "about" && <AboutTab user={user} backendProfile={backendProfile} />}
          {activeTab === "trips" && <PastTripsTab />}
          {activeTab === "connections" && <ConnectionsTab />}
        </section>
      </div>
    </main>
  );
}
