"use client";

import Link from "next/link";
import Image from "next/image";
import { Bot, CarFront } from "lucide-react";
import Navbar from "./components/navbar";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import API_BASE_URL from "../app/config"

export default function Home() {
  const router = useRouter();
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    console.log("profilemethod called");

    console.log(token);
    try {
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
      if (Userdetail.status === 200) {
        router.push("/bookride");
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        text:
          err?.response?.data?.message ||
          "Something went Wrong Please try again",
      });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="flex flex-col-reverse lg:flex-row items-center justify-between px-8 py-16 max-w-7xl mx-auto gap-10">
        {/* Text Content */}
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Your AI Voice <span className="text-purple-600">Ride Booking</span>{" "}
            Partner
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Book your cab with just your voice. No typing, no stress. Let our
            smart assistant handle the rest!
          </p>

          <button
            onClick={fetchUserProfile}
            className="mt-6 px-6 py-3 bg-purple-600 text-white text-lg rounded-full hover:bg-purple-700 transition"
          >
            🎤 Let's Book a Ride
          </button>
        </div>

        {/* AI & Taxi Image */}
        <div className="relative w-full max-w-md">
          <Image
            src="/ai-taxi.png" // Place your image inside public/ as ai-taxi.png
            alt="AI Assistant Taxi"
            width={500}
            height={500}
            className="rounded-xl shadow-lg"
          />
          <div className="absolute bottom-4 left-4 bg-white p-2 rounded-full shadow-md flex items-center gap-2">
            <Bot className="text-purple-600 w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">
              AI Assistant Active
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
