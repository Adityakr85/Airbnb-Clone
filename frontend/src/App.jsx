import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Wishlist from "./pages/User/Wishlist";
import Trips from "./pages/User/Trips";
import Messages from "./pages/User/Messages";
import Profile from "./pages/User/UserProfile/Profile";
import EditProfile from "./pages/User/UserProfile/EditProfile";
import Notifications from "./pages/User/Notifications";
import AccountSettings from "./pages/User/AccountSettings";
import HostDashboard from "./pages/Host/HostDashboard";
import AddProperty from "./pages/Host/AddProperty";
import MyProperties from "./pages/Host/MyProperties";
import PropertyAnalytics from "./pages/Host/PropertyAnalytics";
import HostReservations from "./pages/Host/HostReservations";
import { HostProvider } from "./pages/Host/HostContext";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  const isHostRoute = useLocation().pathname.startsWith("/host");
  return (
    <>
      {!isAdminRoute && !isHostRoute && <Navbar />}
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pages/User/Wishlist" element={<Wishlist />} />
        <Route path="/pages/User/Trips" element={<Trips />} />
        <Route path="/pages/User/Messages" element={<Messages />} />
        <Route path="/pages/User/UserProfile/Profile" element={<Profile />} />
        <Route
          path="/pages/User/UserProfile/EditProfile"
          element={<EditProfile />}
        />
        <Route path="/pages/User/Notifications" element={<Notifications />} />
        <Route
          path="/pages/User/AccountSettings"
          element={<AccountSettings />}
        />
        <Route path="/host" element={<HostDashboard />} />
        <Route path="/host/add-property" element={<AddProperty />} />
        <Route path="/host/properties" element={<MyProperties />} />
        <Route path="/host/analytics" element={<PropertyAnalytics />} />
        <Route path="/host/reservations" element={<HostReservations />} />
      </Routes>
      {!isAdminRoute && !isHostRoute && <Footer />}
    </>
  );
};

export default App;
