import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Toaster />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
