"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";

export default function navbarDriver() {
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const token = localStorage.getItem("Drivertoken");
        const response = await axios.get(
          `${API_BASE_URL}/auth/driver/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.status === 200) {
          setDriver(response.data);
        }
      } catch (error) {
        console.error("Error fetching driver profile:", error);
        setDriver(null);
      }
    };

    fetchDriverProfile();
  }, []);

  const showProfile = async () => {
    const result = await Swal.fire({
      title: "Your Profile",
      html: `
        <div style="text-align: left;">
          <p><strong>Email:</strong> ${driver.email}</p>
          <p><strong>Name:</strong> ${driver.name}</p>
          <p><strong>Driver ID:</strong> ${driver.DriverID}</p>
        </div>
      `,
      background: "#dee2e6", // Tailwind's gray-100
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Close",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
      customClass: {
        popup: "rounded-lg", // adds rounded corners
      },
    });

    if (result.isConfirmed) {
      handleLogout();
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("Drivertoken");
    setDriver(null);
    window.location.href = "/driver";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-violet-800 shadow-md px-4 py-1">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="Voice Ride Buddy"
            className="h-14 w-30 rounded-md"
          />
        </div>

        {/* Desktop Buttons */}
        {!driver ? (
          <>
            <div className="hidden md:flex space-x-4 items-center">
              <Link href="/driver/register">
                <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                  Register
                </button>
              </Link>
              <Link href="/driver/login">
                <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                  Login
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="hidden md:flex space-x-4 items-center">
              <button
                onClick={showProfile}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                My Profile
              </button>
          </div>
        )}
      </div>
    </nav>
  );
}
