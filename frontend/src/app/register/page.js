"use client";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import API_BASE_URL from "../config"


const countryOptions = [
  { label: "India", value: "IN" },
  { label: "Indonesia", value: "ID" },
  { label: "United States", value: "US" },
  { label: "United Kingdom", value: "UK" },
  { label: "Canada", value: "CA" },
  { label: "Germany", value: "DE" },
  { label: "Australia", value: "AU" },
  { label: "Japan", value: "JP" },
  { label: "Singapore", value: "SG" },
  { label: "South Africa", value: "ZA" },
];

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
const router=useRouter()
  const onSubmit = async (data) => {
    console.log(data);
        Swal.fire({
        title: "Register in...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // ✅ Spinner animation
        },
      });
    try {
      const responsesend = await axios.post(
        `${API_BASE_URL}/auth/register`,
        {
          name: data.name,
          email: data.email,
          password: data.password,
          country: data.country.label,
        }
      );
       Swal.close();
      const Userdetail = responsesend.data;
      console.log(responsesend);
      Swal.fire({
        icon: "success",
        text: Userdetail.message,
      });
      router.push("/login")
    } catch (error) {
       Swal.close();
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });

      // Optional: log error for debugging
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              placeholder="Your Name"
              {...register("name", { required: true })}
              className="w-full text-sm text-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">Name is required</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              placeholder="example@gmail.com"
              type="email"
              {...register("email", { required: true })}
              className="w-full text-black text-sm px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">Email is required</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              placeholder=""
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
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-black-700 text-black mb-1">
              Country
            </label>
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={countryOptions}
                  placeholder="Select a country"
                  isSearchable
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      color: "black", // text color
                      backgroundColor: state.isFocused ? "#f0f0f0" : "white", // on hover
                    }),
                    control: (provided) => ({
                      ...provided,
                      borderColor: "#ccc",
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: "black", // selected value text color
                    }),
                    input: (provided) => ({
                      ...provided,
                      color: "black", // input text color while typing
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999, // ensure dropdown isn't hidden by other components
                    }),
                  }}
                />
              )}
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">Country is required</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
          >
            Submit
          </button>
          <div className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
                Login
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
