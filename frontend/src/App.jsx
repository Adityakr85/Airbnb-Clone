import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Experiences from "./pages/Experiences";
import ExperienceDetails from "./components/ExperienceDetails";
import Services from "./pages/Services";
import PropertyDetails from "./pages/PropertyDetails";

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
import AddProperty from "./pages/Host/AddProperty";
import HostDashboard from "./pages/Host/HostDashboard";
import HostReservations from "./pages/Host/HostReservations";
import HostProperties from "./pages/Host/HostProperties";
import PropertyAnalytics from "./pages/Host/PropertyAnalytics";

import ProtectedAdminPage from "./routes/ProtectedAdminPage";
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
        <Route path="/become-a-host" element={<BecomeAHost />} />
        <Route
          path="/host"
          element={
            <HostProvider>
              <HostLayout />
            </HostProvider>
          }
        >
          <Route index element={<HostDashboard />} />
          <Route path="reservations" element={<HostReservations />} />
          <Route path="properties" element={<HostProperties />} />
          <Route path="analytics" element={<PropertyAnalytics />} />
        </Route>
        <Route
          path="/host/add-property"
          element={
            <HostProvider>
              <AddProperty />
            </HostProvider>
          }
        />
        TODO: Protected routes for ADMIN pages based on roles and permissions
        <Route
          path="/admin"
          element={
            <ProtectedAdminPage>
              <AdminLayout />
            </ProtectedAdminPage>
          }
        >
          <Route
            index
            element={
              <ProtectedAdminPage page="dashboard">
                <AdminDashboard />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedAdminPage page="users">
                <Users />
              </ProtectedAdminPage>
            }
          />

          <Route
            path="properties"
            element={
              <ProtectedAdminPage page="properties">
                <Properties />
              </ProtectedAdminPage>
            }
          />

          <Route
            path="experiences"
            element={
              <ProtectedAdminPage page="experiences">
                <AdminExperiences />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="categories"
            element={
              <ProtectedAdminPage page="categories">
                <Categories />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="reservations"
            element={
              <ProtectedAdminPage page="reservations">
                <Reservations />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="payments"
            element={
              <ProtectedAdminPage page="payments">
                <Payments />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="reviews"
            element={
              <ProtectedAdminPage page="reviews">
                <Reviews />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedAdminPage page="reports">
                <Reports />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="support"
            element={
              <ProtectedAdminPage page="support">
                <Support />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedAdminPage page="notifications">
                <AdminNotifications />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="marketing"
            element={
              <ProtectedAdminPage page="marketing">
                <Marketing />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="featured-listings"
            element={
              <ProtectedAdminPage page="featured-listings">
                <FeaturedListings />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="cms"
            element={
              <ProtectedAdminPage page="cms">
                <CMS />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedAdminPage page="analytics">
                <Analytics />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="activity-logs"
            element={
              <ProtectedAdminPage page="activity-logs">
                <ActivityLogs />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="monitoring"
            element={
              <ProtectedAdminPage page="monitoring">
                <Monitoring />
              </ProtectedAdminPage>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedAdminPage page="settings">
                <SystemSettings />
              </ProtectedAdminPage>
            }
          />
        </Route>
      </Routes>
      {!isAdminRoute && !isHostRoute && <Footer />}
    </>
  );
};

export default App;
