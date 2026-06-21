"use client";
import NavbarDriver from "../components/navbarDriver.js";
import Image from "next/image";
import { Car } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Driver() {
    const router = useRouter();

    function handleDriverDashboard() {
        router.push("/driver/dashboard");
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-50">
      <NavbarDriver />

      <div className="max-w-6xl mx-auto px-6 py-10  mt-10">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-xl md:text-4xl font-bold text-gray-800 leading-tight mb-4">
              Welcome Driver Partner 🚗
            </h1>

            <p className="text-gray-800 mb-6 text-lg">
              Manage your rides, track earnings, and accept ride requests
              seamlessly with Voice Ride Buddy.
            </p>

            <button  onClick={() => handleDriverDashboard()} className="flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-md font-semibold transition">
              <Car size={50} />
             Go to Driver Dashboard
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center mt-2">
            <Image
              src="/driver-illustration.png"
              alt="Driver"
              width={320}
              height={180}
              className="rounded-2xl shadow-lg w-64 h-auto"
               priority   // This will ensure the image is loaded immediately for better performance
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-18">
          <div className="bg-purple-600 shadow-lg p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2 text-white">
              🚘 Accept Ride Requests
            </h3>
            <p className="text-white text-sm ">
              Receive ride requests from nearby passengers and accept them
              instantly.
            </p>
          </div>

          <div className="bg-purple-600 shadow-lg p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2 text-white">
              💰 Track Earnings
            </h3>
            <p className="text-white text-sm">
              Monitor your daily and monthly earnings with detailed reports.
            </p>
          </div>

          <div className="bg-purple-600 shadow-lg p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2 text-white">
              📍 Smart Navigation
            </h3>
            <p className="text-white text-sm">
              Navigate to pickup and drop locations easily using built-in maps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
