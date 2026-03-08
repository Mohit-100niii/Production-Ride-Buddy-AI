"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import API_BASE_URL from "../config"

export default function LoginPage() {
  console.log(API_BASE_URL)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    console.log(data);
     Swal.fire({
    title: "Logging in...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading(); // ✅ Spinner animation
    },
  });
    try {
      const responsesend = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );
      const Userdetail = responsesend.data;
      console.log(responsesend);
       Swal.close();

      if (Userdetail.status === 200) {
        localStorage.setItem("token", Userdetail.token);
        router.push("/bookride");

        Swal.fire({
          icon: "success",
          text: Userdetail.message,
        });
      }     
    } catch (error) {
       Swal.close();

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
       setloader(false)
      console.error("Login error:", error);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-50">
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Login
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            {...register("email", { required: true })}
            className="w-full text-black text-sm px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">Email is required</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 10,
                message: "Password must be exactly 10 characters",
              },
              maxLength: {
                value: 10,
                message: "Password must be exactly 10 characters",
              },
            })}
            className="w-full text-black text-sm px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

 
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
        >
          Submit
        </button>

        <div className="text-sm text-gray-600 mt-4 text-center">
          Not have an Account?{" "}
          <Link href="/register">
            <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
              Register
            </span>
          </Link>
        </div>
      </form>
    </div>
  </div>
);

}