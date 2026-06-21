import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { canAccess, isAdminStaff } from "../config/AdminAccess";

export default function ProtectedAdminPage({ page, children }) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  const role = user?.publicMetadata?.role;

  // block users with no admin role
  if (!isAdminStaff(role)) {
    return <Navigate to="/" replace />;
  }

  // only check permission if page supplied
  if (page && !canAccess(role, page)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
