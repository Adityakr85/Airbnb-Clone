import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Wishlist from "./pages/User/Wishlist";
import Trips from "./pages/User/Trips";
import Messages from "./pages/User/Messages";
import Profile from "./pages/User/Profile";
import Notifications from "./pages/User/Notifications";
import AccountSettings from "./pages/User/AccountSettings";
import EditProfile from "./pages/User/EditProfile";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Toaster />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pages/User/Wishlist" element={<Wishlist />} />
        <Route path="/pages/User/Trips" element={<Trips />} />
        <Route path="/pages/User/Messages" element={<Messages />} />
        <Route path="/pages/User/Profile" element={<Profile />} />
        <Route path="/pages/User/EditProfile" element={<EditProfile />} />
        <Route path="/pages/User/Notifications" element={<Notifications />} />
        <Route
          path="/pages/User/AccountSettings"
          element={<AccountSettings />}
        />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
