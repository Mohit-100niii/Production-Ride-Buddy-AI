"use client";

import axios from "axios";
import API_BASE_URL from "@/app/config";
import Swal from "sweetalert2";
import driverProfilehook from "@/app/hooks/driverProfilehook";
import { useDriverRideContext } from "@/app/context/DriverRideContext";

export default function TakeRidesPage() {
  const { availableRides, setAvailableRides } = useDriverRideContext();
  const { driver } = driverProfilehook(API_BASE_URL);

  const acceptRide = async (rideId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/driverapi/accept-ride`, {
        ride_request_id: rideId,
        driver_id: driver.DriverID,
      });

      console.log("Accept Ride Response:", res.data);

      if (res.data?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Ride Accepted",
        });

        setAvailableRides((prev) =>
          prev.filter((ride) => ride.ride_request_id !== rideId),
        );
      } else {
        Swal.fire({
          icon: "error",
          title: res.data.message || "Failed to accept ride",
        });
        setAvailableRides((""));
      }
    } catch (error) {
      console.error("Error accepting ride:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to accept ride",
      });
    }
  };

  const rejectRide = async (rideId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/reject-ride`, {
        ride_request_id: rideId,
        driver_id: driver.DriverID,
      });

      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Ride Rejected",
        });

        setAvailableRides((prev) =>
          prev.filter((ride) => ride.ride_request_id !== rideId),
        );
      } else {
        Swal.fire({
          icon: "error",
          title: res.data.message || "Failed to reject ride",
        });
      }
    } catch (error) {
      console.error("Error rejecting ride:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to reject ride",
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Rides</h1>

      {availableRides.length === 0 ? (
        <p>No rides available right now</p>
      ) : (
        <div className="space-y-4">
          {availableRides.map((ride) => (
            <div
              key={ride.ride_request_id}
              className="bg-green-400 shadow-md rounded-lg p-4 flex justify-between items-center"
            >

              <div>
                <p>ride_request_id: {ride.ride_request_id}</p>
              </div>
              <div className="text-black">
                <p className="font-semibold">
                  {ride.pickup} → {ride.drop}
                </p>
                <p className="text-black">Fare: ₹{ride.fare}</p>
              </div>

              <div className="display-flex space-x-2">
                <button
                  onClick={() => acceptRide(ride.ride_request_id)}
                  className="bg-green-800 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRide(ride.ride_request_id)}
                  className="bg-red-800 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
