"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Route, IndianRupee } from "lucide-react";
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
      const token = localStorage.getItem("token");
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

    if (isRecording) 
    {
      recognitionRef.current.stop();

      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
      }      
    } 
    else {
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
        text: "Unable to Book Ride at this Time !",
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
                <p className="text-red-500">{parsedData.error}</p>
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

          {parsedData && (
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
