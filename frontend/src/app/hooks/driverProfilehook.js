"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function driverProfilehook(API_BASE_URL) {
 // console.log("API Base URL in driverProfilehook:", API_BASE_URL);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

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
          }
        );
        //console.log("Driver Profile Response:", response.data);
        if (response.data.status === 200) {
          setDriver(response.data);
        } else {
          setDriver(null);
        }
      } catch (error) {
        console.error("Error fetching driver profile:", error);
        setDriver(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverProfile();
  }, [API_BASE_URL]);

  return { driver, loading };
}