import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import AppWrapper from "./AppWrapper.jsx";
import AdminDashboard from "./pages/adminpages/AdminDashboard.jsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          {/* ✅ Admin routes handled outside AppWrapper */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* ✅ Wrap only user routes inside AppWrapper */}
          <Route
            path="/*"
            element={
              <AppWrapper>
                <App />
              </AppWrapper>
            }
          />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
