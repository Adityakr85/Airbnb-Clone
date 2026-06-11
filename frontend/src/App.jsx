import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Wishlist from "./pages/User/Wishlist";
import Trips from "./pages/User/Trips";
import BookingDetails from "./pages/User/BookingDetails";
import Messages from "./pages/User/Messages";
import Profile from "./pages/User/Profile";
import Notifications from "./pages/User/Notifications";
import Settings from "./pages/User/Settings";

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
        <Route path="/pages/User/BookingDetails/:id" element={<BookingDetails />}/>    
        <Route path="/pages/User/Messages" element={<Messages />} />
        <Route path="/pages/User/Profile" element={<Profile />} />
        <Route path="/pages/User/Notifications" element={<Notifications />} />
        <Route path="/pages/User/Settings" element={<Settings />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
