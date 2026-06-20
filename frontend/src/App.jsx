import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Experiences from "./pages/Experiences";
import ExperienceDetails from "./components/ExperienceDetails";
import Services from "./pages/Services";
import PropertyDetails from "./pages/PropertyDetails";

import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Wishlist from "./pages/User/Wishlist";
import Trips from "./pages/User/Trips";
import BookingDetails from "./pages/User/BookingDetails";
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
import BecomeAHost from "./pages/Host/BecomeAHost";
import { HostProvider } from "./pages/Host/HostContext";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import Properties from "./pages/Admin/Properties";
import Reservations from "./pages/Admin/Reservations";
import Reviews from "./pages/Admin/Reviews";
import AdminNotifications from "./pages/Admin/Notifications";
import Categories from "./pages/Admin/Categories";
import AdminExperiences from "./pages/Admin/Experiences";
import Payments from "./pages/Admin/Payments";
import Settings from "./pages/Admin/Settings";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  const isHostRoute =
    useLocation().pathname.startsWith("/host") ||
    useLocation().pathname === "/become-a-host";
  return (
    <>
      {!isAdminRoute && !isHostRoute && <Navbar />}
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/experience/:id" element={<ExperienceDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/property/:id" element={<PropertyDetails />} />

        <Route path="/pages/User/Wishlist" element={<Wishlist />} />
        <Route path="/pages/User/Trips" element={<Trips />} />
        <Route
          path="/pages/User/BookingDetails/:id"
          element={<BookingDetails />}
        />
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
        <Route
          path="/host"
          element={
            <HostProvider>
              <HostDashboard />
            </HostProvider>
          }
        />
        <Route
          path="/host/add-property"
          element={
            <HostProvider>
              <AddProperty />
            </HostProvider>
          }
        />
        <Route
          path="/host/properties"
          element={
            <HostProvider>
              <MyProperties />
            </HostProvider>
          }
        />
        <Route
          path="/host/analytics"
          element={
            <HostProvider>
              <PropertyAnalytics />
            </HostProvider>
          }
        />
        <Route
          path="/host/reservations"
          element={
            <HostProvider>
              <HostReservations />
            </HostProvider>
          }
        />
        <Route path="/become-a-host" element={<BecomeAHost />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="properties" element={<Properties />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="categories" element={<Categories />} />
          <Route path="experiences" element={<AdminExperiences />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      {!isAdminRoute && !isHostRoute && <Footer />}
    </>
  );
};

export default App;
