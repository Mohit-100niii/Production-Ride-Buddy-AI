"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../../config";
import { useRouter } from "next/navigation";
import driverProfilehook from "@/app/hooks/driverProfilehook";
import { useDriverRideContext } from "@/app/context/DriverRideContext";

export default function Sidebar() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const socketRef = useRef(null);
  const { driver, loading } = driverProfilehook(API_BASE_URL);
  const { availableRides, setAvailableRides } = useDriverRideContext();
  

  const connectDriverSocket = () => {
    if (!driver?.DriverID) {
      console.log("DriverID not available yet");
      return;
    }
    const WS_BASE_URL = API_BASE_URL.replace("http://", "ws://").replace(
      "https://",
      "wss://",
    );

    socketRef.current = new WebSocket(
      `${WS_BASE_URL}/ws-driver/?driverid=${driver.DriverID}`,
    );
    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message from backend:", data);

      if (data.type === "NEW_RIDE_REQUEST") {
        setAvailableRides((prev) => [...prev, data]);
      }

      if (data.type === "RIDE_REMOVED") {
        setAvailableRides((prev) =>
          prev.filter((ride) => ride.ride_request_id !== data.ride_request_id),
        );
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
      socketRef.current = null;
    };

    socketRef.current.onerror = (error) => {
      console.log("WebSocket error:", error);
    };
  };

  const handleIsSetIsActive = async () => {
    try {
      const token = localStorage.getItem("Drivertoken");
      console.log("Driver Token:", token);
      const res = await axios.post(
        `${API_BASE_URL}/driverapi/update/status`,
        {
          status: !isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.status === 200) {
        console.log("Driver status updated successfully");
        if (res.data.isActive == true) {
          connectDriverSocket();
          Swal.fire({
            icon: "success",
            title: "You are now Active",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "You are now Offline",
          });
          router.push("/driver/dashboard");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to update status",
          text: "Please try again.",
        });
      }
    } catch (error) {
      console.log("Error toggling driver status:", error);
    }

    setIsActive((prev) => !prev);
  };

  const handleCheckDriverStatus = async () => {
    try {
      const token = localStorage.getItem("Drivertoken");
      console.log("Driver Token:", token);
      const res = await axios.get(`${API_BASE_URL}/driverapi/get/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.Status === true && res.data.status === 200) {
        router.push("/driver/dashboard/take-rides");
      } else if (res.data.Status === false && res.data.status === 200) {
        Swal.fire({
          icon: "error",
          title: "You are currently Offline",
          text: "Please switch to Active status to take rides.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load",
        text: "Please try again.",
      });
      console.log("Error fetching driver status:", error);
    }
  };

  const linkClass = (path) =>
    `block  rounded-md ${
      pathname === path ? "bg-purple-600 text-white" : "text-gray-700"
    }`;

  return (
    <div className="w-64 bg-violet-800 shadow-md min-h-screen p-8">
      <h2 className="text-xl text-black font-bold mb-6 mt-15 bg-violet-300 rounded-md px-4 py-2 ">
        Driver Panel
      </h2>
      {/* 🔹 DRIVER STATUS TOGGLE */}
      <div className="mb-6">
        <p className="mb-2 font-semibold">
          Status: {isActive ? "Active" : "Offline"}
        </p>

        <div
          onClick={() => handleIsSetIsActive()}
          className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
            isActive ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
              isActive ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </div>
      </div>

      <ul className="space-y-2">
        <li>
          <div
            onClick={handleCheckDriverStatus}
            className="text-black  text-xl bg-purple-300 rounded-md px-4 py-2 hover:bg-purple-400 transition"
          >
            Take Rides
          </div>
        </li>

        <li>
          <Link
            href="/driver/dashboard/rides"
            className={linkClass("/driver/dashboard/rides")}
          >
            <div className="text-black  text-xl bg-purple-300 rounded-md px-4 py-2 hover:bg-purple-400 transition">
              Your Rides
            </div>
          </Link>
        </li>

        <li>
          <Link
            href="/driver/dashboard/analytics"
            className={linkClass("/driver/dashboard/analytics")}
          >
            <div className="text-black  text-xl bg-purple-300 rounded-md px-4 py-2    hover:bg-purple-400 transition">
              Analytics
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
