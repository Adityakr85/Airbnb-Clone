import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SyncClerkUser from "./config/SyncClerkUser";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Public/Home";
import Experiences from "./pages/Public/Experiences";
import ExperienceDetails from "./components/ExperienceDetails";
import Services from "./pages/Public/Services";
import PropertyDetails from "./pages/Public/PropertyDetails/PropertyDetails";

import Wishlist from "./pages/User/Wishlist";
import Trips from "./pages/User/Trips";
import BookingDetails from "./pages/User/BookingDetails";
import Messages from "./pages/User/Messages";
import Profile from "./pages/User/UserProfile/Profile";
import EditProfile from "./pages/User/UserProfile/EditProfile";
import Notifications from "./pages/User/Notifications";
import AccountSettings from "./pages/User/AccountSettings";

import HostLayout from "./pages/Host/HostLayout";
import { HostProvider } from "./pages/Host/HostContext";
import BecomeAHost from "./pages/Host/BecomeAHost";
import AddProperty from "./pages/Host/AddProperty/AddProperty";
import HostDashboard from "./pages/Host/HostDashboard";
import HostReservations from "./pages/Host/HostReservations";
import HostProperties from "./pages/Host/HostProperties";
import PropertyAnalytics from "./pages/Host/PropertyAnalytics";

import ProtectedAdminPage from "./pages/Admin/ProtectedAdminPage";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import Properties from "./pages/Admin/Properties";
import AdminExperiences from "./pages/Admin/Experiences";
import Categories from "./pages/Admin/Categories";
import Reservations from "./pages/Admin/Reservations";
import Payments from "./pages/Admin/Payments";
import Reviews from "./pages/Admin/Reviews";
import Reports from "./pages/Admin/Reports";
import Support from "./pages/Admin/Support";
import AdminNotifications from "./pages/Admin/Notifications";
import Marketing from "./pages/Admin/Marketing";
import FeaturedListings from "./pages/Admin/FeaturedListings";
import CMS from "./pages/Admin/CMS";
import Analytics from "./pages/Admin/Analytics";
import ActivityLogs from "./pages/Admin/ActivityLogs";
import Monitoring from "./pages/Admin/Monitoring";
import SystemSettings from "./pages/Admin/SystemSettings";

import Landing from "./pages/Help/Landing";
import ArticleDetails from "./pages/Help/ArticleDetails";
import AllTopics from "./pages/Help/AllTopics";
import Cancellations from "./pages/Help/Cancellations";
import HelpCenterNavbar from "./pages/Help/HelpCenterNavbar";
import SearchResultsPage from "./pages/Help/SearchResultsPages";

const App = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isAdminRoute = currentPath.startsWith("/admin");
  const isHostRoute =
    currentPath.startsWith("/host") || currentPath === "/become-a-host";

  const isHelpRoute =
    currentPath.startsWith("/help") || currentPath.startsWith("/pages/help");

  return (
    <>
      <SyncClerkUser />

      {!isAdminRoute &&
        !isHostRoute &&
        (isHelpRoute ? <HelpCenterNavbar /> : <Navbar />)}

      <Toaster position="top-center" />

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
          element={
            <HostProvider>
              <HostLayout />
            </HostProvider>
          }
        >
          <Route path="/become-a-host" element={<BecomeAHost />} />
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/host/add-property" element={<AddProperty />} />
          <Route path="/host/edit-property/:id" element={<AddProperty />} />
          <Route path="/host/reservations" element={<HostReservations />} />
          <Route path="/host/properties" element={<HostProperties />} />
          <Route path="/host/analytics" element={<PropertyAnalytics />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedAdminPage>
              <AdminLayout />
            </ProtectedAdminPage>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="properties" element={<Properties />} />
          <Route path="experiences" element={<AdminExperiences />} />
          <Route path="categories" element={<Categories />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="reports" element={<Reports />} />
          <Route path="support" element={<Support />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="featured-listings" element={<FeaturedListings />} />
          <Route path="cms" element={<CMS />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>

        <Route path="/help">
          <Route index element={<Landing />} />
          <Route path="article/:id" element={<ArticleDetails />} />
          <Route path="all-topics" element={<AllTopics />} />
          <Route path="topic/:id" element={<Cancellations />} />
          <Route path="search" element={<SearchResultsPage />} />
        </Route>
      </Routes>

      {!isAdminRoute && !isHostRoute && <Footer />}
    </>
  );
};

export default App;
