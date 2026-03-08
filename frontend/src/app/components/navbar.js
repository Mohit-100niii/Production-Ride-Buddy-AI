"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import API_BASE_URL from "../config"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router=useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const responsesget = await axios.get(`${API_BASE_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const Userdetail = responsesget.data;
        if (Userdetail.status === 200) {
          setUser(Userdetail);
        }
      } catch (err) {
        setUser(null);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

 const showProfile = async () => {
  const result = await Swal.fire({
    title: "Your Profile",
    html: `
      <div style="text-align: left;">
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Name:</strong> ${user.name}</p>
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
      popup: 'rounded-lg', // adds rounded corners
    }
  });

  if (result.isConfirmed) {
    handleLogout();
  }
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

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          {!user ? (
            <>
              <Link href="/register">
                <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                  Register
                </button>
              </Link>
              <Link href="/login">
                <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                  Login
                </button>
              </Link>
            </>
          ) : (
            <>
            <button
              onClick={showProfile}
              className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              My Profile
            </button>
            <Link href="/myrides">
                <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                  My Rides
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 mr-0 flex flex-col space-y-2">
          {!user ? (
            <>
              <Link href="/register">
                <button className="w-40 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                  Register
                </button>
              </Link>
              <Link href="/login">
                <button className="w-40 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                  Login
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={showProfile}
              className="w-40 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition "
            >
              My Profile
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
