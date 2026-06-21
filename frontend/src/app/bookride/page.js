"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Route, IndianRupee, Phone } from "lucide-react";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";
import API_BASE_URL from "../config.js";

export default function BookRide() {
  const [backendMessage, setBackendMessage] = useState("");
  const [isListening, setIsListening] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const recognitionRef = useRef(null);
  const [isRideBookButton, setIsRideBookButton] = useState(false);
  const [parsedData, setparsedData] = useState("");
  const [user, SetuserData] = useState("");
  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);
  const [isFindingDriver, setIsFindingDriver] = useState(false);
  const [rideRequestSent, setRideRequestSent] = useState(false);
  const [rideId, setRideId] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Cleanup socket on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        console.log("WebSocket disconnected on component unmount");
      }
    };
  }, []);

  
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/test`);
        setBackendMessage(res.data.message);
      } catch (err) {
        setBackendMessage("❌ Backend not reachable");
      }
    };
    fetchMessage();

    const fetchUserProfile = async () => {
      const token = localStorage.getItem("Usertoken");
      console.log("profilemethod called");

      console.log(token);
      try {
        const responsesget = await axios.get(`${API_BASE_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const Userdetail = responsesget.data;
        console.log(Userdetail);
        if (Userdetail.status === 200) {
          SetuserData(responsesget.data);
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

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const results = [];
      for (const result of event.results) {
        results.push({
          text: result[0].transcript,
          isFinal: result.isFinal,
        });
      }
      setTranscript(results);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleMicClick = () => {
    //Exit Early if No Speech Recognition Setup
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();

      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
      }
    } else {
      setTranscript([]);
      setparsedData("");
      const welcomeMessage =
        "Hi! Welcome to RideBuddy. Please say your pickup and drop location, time, travel date, and vehicle type to book your ride.";

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(welcomeMessage);
        utterance.lang = "en-GB";
        speechSynthesis.speak(utterance);

        // start recording AFTER greeting finishes event handler
        utterance.onend = () => {
          recognitionRef.current.start();
          //from here code goes to useeffect of isRecording that is recognition.onresult
        };
      }

      //recognitionRef.current.start();
    }

    setIsRecording(!isRecording);
  };

  const handleSendVoice = async () => {
    Swal.fire({
      title: "Ride Booking is in Progress...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // show spinner
      },
    });
    try {
      const finalTranscript = transcript
        .filter((line) => line.isFinal)
        .map((line) => line.text)
        .join(" ");
      const response = await axios.post(`${API_BASE_URL}/bookvoiceride`, {
        text: finalTranscript,
      });
      Swal.close();
      setparsedData(response.data);
      setIsRecording(false);
      console.log(parsedData.pickup);
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        //text: "Unable to Book Ride at this Time !",
        text : error?.response?.data?.error + "Please try again" || "Please try again later.",
      });
    }
    
  };

  const Completepayment = async () => {
    console.log(100, parsedData.expected_fare ? parsedData.expected_fare : 101);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/payment`, {
        fare: parsedData.expected_fare ? parsedData.expected_fare : 101,
        pickup: parsedData.pickup,
        dropup: parsedData.drop,
        date: parsedData.date ? parsedData.date : "Not Mention",
        time: parsedData.time ? parsedData.time : "Not Mention",
      });

      const details = res.data;

      if (details.status === 200 && details.url) {
        window.location.href = details.url;
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: "Could not retrieve payment session URL.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Unable to process payment at this time. Please try again later.",
      });
      console.error("Payment initiation error:", err);
    }
  };

  const findNearbyDrivers = async () => {
    if (!parsedData) return;

    setIsFindingDriver(true);

    try {
      const token = localStorage.getItem("Usertoken");

      const response = await axios.post(
        `${API_BASE_URL}/findDriver/create-ride-request`,
        {
          pickup: parsedData.pickup,
          drop: parsedData.drop,
          date: parsedData.date || "Not Mention",
          time: parsedData.time || "Not Mention",
          fare: parsedData.expected_fare || 101,
          distance: parsedData.distance || 0,
          userId: user._id,

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;

      if (data.status === 200) {
          setRideRequestSent(true);
          setRideId(data.ride_request_id);
          console.log("Ride Request Created:", data);

          // WEBSOCKET CONNECTION SETUP - SAME AS DRIVER SIDEBAR
          const WS_BASE_URL = API_BASE_URL.replace("http://", "ws://").replace(
            "https://",
            "wss://",
          );
          

          const token = localStorage.getItem("Usertoken");
          console.log(token, user._id, data.ride_request_id);

          const socket = new WebSocket(
            `${WS_BASE_URL}/ws-user/?userid=${user._id}&rideid=${data.ride_request_id}&token=${token}`,
          );

          socketRef.current = socket;

          socket.onopen = () => {
            console.log("WebSocket connected");

            // Notify backend that user is waiting for driver
            // socket.send(JSON.stringify({
            //   type: "USER_WAITING",
            //   rideId: data.ride_request_id,
            //   userId: user._id,
            // }));
          };

          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Message from backend:", data);

            if (data.type === "DRIVER_ASSIGNED") {
              console.log("Driver assigned:", data);
              setDriverInfo(data.driver);
              setIsFindingDriver(false);
              Swal.fire({
                icon: "success",
                title: "Driver Found!",
                text: `${data.driver.name} is heading towards you`,
                timer: 3000,
              });
            }

            if (data.type === "DRIVER_LOCATION_UPDATE") {
              console.log("Driver location:", data.location);
              // Update map or show distance
            }

            if (data.type === "RIDE_STATUS_UPDATE") {
              console.log("Ride status:", data.status);
            }
          };

          socket.onerror = (error) => {
            console.log("WebSocket error:", error);
            setIsFindingDriver(false);
            Swal.fire({
              icon: "error",
              title: "Connection Error",
              text: "Real-time updates unavailable",
            });
          };

          socket.onclose = () => {
            console.log("WebSocket closed");
            socketRef.current = null;
            setIsFindingDriver(false);
          };

          Swal.fire({
            icon: "success",
            title: "Ride Request Sent",
            text: "Searching for nearby drivers...",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          setIsFindingDriver(false);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unable to find drivers right now.",
          });
      }
    } catch (error) {
      setIsFindingDriver(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Unable to send ride request.",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-blue-50 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-purple-700 mb-4">
            🚖 RideBuddy AI
          </h1>
          <p className="text-gray-600 mb-2">
            Talk to book a ride. Example: "Book a cab from Delhi to Airport at 7
            PM"
          </p>

          <button
            onClick={handleMicClick}
            className={`mb-4 px-6 py-2 rounded-full text-white font-semibold ${
              isRecording ? "bg-red-500" : "bg-green-600"
            }`}
          >
            {isRecording ? "🛑 Stop" : "🎤 Start Voice Input"}
          </button>
          {!parsedData && (
            <div className="bg-gray-100 rounded p-3 text-sm font-mono">
              <p className="mb-1 text-gray-500">🗣️ Transcript:</p>
              <div className="mt-4">
                {transcript.map((line, i) => (
                  <p
                    key={i}
                    className={
                      line.isFinal ? "font-bold text-black" : "text-gray-500"
                    }
                  >
                    {line.text}
                  </p>
                ))}
              </div>
            </div>
          )}

          {parsedData && (
            <div className="mt-4 bg-gray-100 rounded p-3 text-left text-sm font-mono">
              <p className="mb-1 text-black">📦 Extracted Ride Details:</p>
              {parsedData.error ? (
                <div>
                <p className="text-red-500">{parsedData.error} </p>
                <p className="text-red-500">Please try again later.</p>
                </div>
              ) : (
                <>
                  <p className="mb-1 text-black">
                    📍 Pickup: <strong>{parsedData.pickup}</strong>
                  </p>
                  <p className="mb-1 text-black">
                    🏁 Drop: <strong>{parsedData.drop}</strong>
                  </p>
                  <p className="mb-1 text-black">
                    🕒 Time: <strong>{parsedData.time}</strong>
                  </p>
                  <p className="mb-1 text-black">
                    📅 Date: <strong>{parsedData.date}</strong>
                  </p>
                  <p className="mb-1 text-black flex items-center gap-2">
                    <Route className="w-4 h-4 text-gray-600" />
                    Distance: <strong>{parsedData.distance} km</strong>
                  </p>

                  <p className="mb-1 text-black flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    Fare:{" "}
                    <strong>
                      {parsedData.expected_fare
                        ? parsedData.expected_fare
                        : 101}{" "}
                      ₹
                    </strong>
                  </p>

                </>
              )}
            </div>
          )}

          {!parsedData && transcript.some((line) => line.isFinal) && (
            <button
              onClick={handleSendVoice}
              className="mb-4 px-6 py-2 rounded-full text-white font-semibold bg-blue-600 hover:bg-blue-700 mt-4"
            >
              🚀 Proceed to Book Ride
            </button>
          )}

          {parsedData?.status === "200" && !rideRequestSent && (
            <button
              onClick={findNearbyDrivers}
              className="mb-4 px-2 py-2 w-full rounded-md text-white font-semibold bg-green-600 hover:bg-green-800 mt-2"
            >
              🚕 Find Nearby Drivers
            </button>
          )}

          {rideRequestSent && !driverInfo && isFindingDriver && (
            <div className="mt-4 bg-yellow-50 rounded-2xl p-5 text-center text-sm border border-yellow-300 shadow-sm">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
              <p className="text-yellow-900 font-semibold text-lg">
                Searching for a driver...
              </p>
              <p className="mt-2 text-yellow-700">
                Hang tight — matching your ride with nearby drivers.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-600 animate-bounce" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-600 animate-bounce delay-150" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-600 animate-bounce delay-300" />
              </div>
            </div>
          )}

          {rideRequestSent && driverInfo && (
            <div className="mt-4 bg-blue-50 rounded p-3 text-left text-sm border-2 border-blue-400">
              <p className="mb-2 text-black font-bold">🚗 Driver Assigned:</p>
              <p className="mb-1 text-black">
                👤 Name: <strong>{driverInfo.name}</strong>
              </p>
              {driverInfo.phone && (
                <p className="mb-1 text-black flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span>Phone: <strong>{driverInfo.phone}</strong></span>
                </p>
              )}
            </div>
          )}

          {parsedData && driverInfo && (
            <button
              onClick={Completepayment}
              className="mb-4 px-2 py-2 w-95  rounded-md text-white font-semibold bg-green-600 hover:bg-green-800 mt-2"
            >
              <p>
                Proceed to Pay ₹
                {parsedData.expected_fare ? parsedData.expected_fare : 101}
              </p>
            </button>
          )}

          <p className="mt-4 text-xs text-gray-400">
            Backend: {backendMessage}
          </p>
        </div>
      </div>
    </>
  );
}
