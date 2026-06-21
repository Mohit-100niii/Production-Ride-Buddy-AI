"use client";

import NavbarDriver from "../../components/navbarDriver";
import Sidebar from "../../components/driver/Sidebar";
import { DriverRideProvider } from "@/app/context/DriverRideContext";

export default function Layout({ children }) {
  return (
    <DriverRideProvider>
      <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-50">
        {/* Top Navbar */}
        <NavbarDriver />

        {/* Main Layout */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 p-6">{children}</div>
        </div>
      </div>
    </DriverRideProvider>
  );
}