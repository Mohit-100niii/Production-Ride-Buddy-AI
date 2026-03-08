"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapPinIcon, CalendarIcon, ClockIcon, ArrowRightIcon,EnvelopeIcon  } from "@heroicons/react/24/solid";
import { Route, IndianRupee } from "lucide-react";
import API_BASE_URL from "../config"


export default function PaymentSuccess() {
  const router = useRouter();
  const [last_ride_detail, setLastRide] = useState("");

  useEffect(() => {
    const fetchprofile = async () => {
      try {
        const token = localStorage.getItem("token");
        const responsesget = await axios.get(
          `${API_BASE_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const Userdetail = responsesget.data;
        console.log(Userdetail);
        const response = await axios.get(
          `${API_BASE_URL}/api/get-last-ride`,
          {
            params: { email: Userdetail.email },
          }
        );

        console.log(response.data.last_ride);
        setLastRide(response.data.last_ride);
        console.log(last_ride_detail.pickup);
      } catch (err) {
        console.log(err);
      }
    };
    fetchprofile();
  }, []);
  const handleGoHome = () => {
    router.push("/");
  };

  const handlesendEmail =()=>{
    console.log("Email Send")
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-purple-700 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          🎉 Your ride has been booked successfully.
        </p>

        {/* Ride Summary (Static or pass via query param/localStorage) */}
    <div className="bg-gray-300 rounded-md p-4 text-left text-black text-sm mb-6 space-y-2">
  <p className="flex items-center gap-2">
    <MapPinIcon className="w-4 h-4 text-purple-600" />
    <strong>Pickup:</strong> {last_ride_detail.pickup || "N/A"}
  </p>

  <p className="flex items-center gap-2">
    <ArrowRightIcon className="w-4 h-4 text-purple-600" />
    <strong>Drop:</strong> {last_ride_detail.dropup || "N/A"}
  </p>

  <p className="flex items-center gap-2">
    <CalendarIcon className="w-4 h-4 text-purple-600" />
    <strong>Date:</strong> {last_ride_detail?.date || "N/A"}
  </p>

  <p className="flex items-center gap-2">
    <ClockIcon className="w-4 h-4 text-purple-600" />
    <strong>Time:</strong> {last_ride_detail?.time || "N/A"}
  </p>

  <p className="flex items-center gap-2">
    <IndianRupee className="w-4 h-4 text-purple-600" />
    <strong>Fare:</strong>  ₹ {last_ride_detail.amount || "N/A"}
  </p>
</div>

<div className="flex gap-4">
  {/* Back to Home */}
  <button
    onClick={handleGoHome}
    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
  >
    Back to Home
  </button>
</div>
      </div>
    </div>
  );
}
