"use client"
import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";

export default function MyRides() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    async function fetchRides() {
      Swal.fire({
        title: "Fetching Rides...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/my-rides`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const datares = await res.json();
        setRides(datares.my_rides_details || []);
      } catch (err) {
        Swal.close();
        console.error("Failed to fetch rides", err);
      } finally {
        Swal.close();
      }
    }
    fetchRides();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">My Previous Rides</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rides.map((ride, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                🚏 {ride.pickup} → 🏁 {ride.dropup}
              </h2>
            </div>
            <div className="mb-2 text-gray-700">
              📅 Date: {ride.date ? ride.date : "N/A"}
            </div>
            <div className="mb-2 text-gray-700">
              ⏰ Time: {ride.time ? ride.time : "N/A"}
            </div>
            <div className="mb-2 text-gray-700">
              💰 Fare: ₹{ride.amount}
            </div>
            <div className="flex justify-end">
              <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                ✅ Completed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
