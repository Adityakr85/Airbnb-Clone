import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export default function SyncClerkUser() {
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    axios
      .post(`${API_BASE}/api/clerk/sync-user`, {
        clerk_id: user.id,
        name:
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "User",
        username: user.username || null,
        first_name: user.firstName || null,
        last_name: user.lastName || null,
        email: user.primaryEmailAddress?.emailAddress || null,
        image_url: user.imageUrl || null,
      })
      .catch((err) => {
        console.error("Failed to sync Clerk user:", err);
      });
  }, [isLoaded, isSignedIn, user]);

  return null;
}
