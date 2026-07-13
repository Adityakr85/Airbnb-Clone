import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { isAdminStaff } from "../../config/AdminAccess";
import { fetchCurrentAdminUser } from "../../api/admin";

export default function ProtectedAdminPage({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();

  const [checking, setChecking] = useState(true);
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      if (!isLoaded) return;

      if (!isSignedIn || !user?.id) {
        setChecking(false);
        return;
      }

      try {
        const data = await fetchCurrentAdminUser(user.id);
        setDbUser(data);
      } catch (err) {
        console.error("Failed to fetch admin user:", err);
        setDbUser(null);
      } finally {
        setChecking(false);
      }
    }

    loadUser();
  }, [isLoaded, isSignedIn, user?.id]);

  if (!isLoaded || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (!dbUser || dbUser.status === "blocked") {
    return <Navigate to="/" replace />;
  }

  if (!isAdminStaff(dbUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
