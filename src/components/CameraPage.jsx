import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CameraPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState(""); // New state
  const [recommendations, setRecommendations] = useState([]); // New state
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Load models once when component mounts
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        console.log("✅ Face-api.js models loaded");
        startVideo();
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isAuthenticated]);

  // Start webcam video
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        streamRef.current = stream;
        if (video) video.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing camera:", err));
  };

  // Send only expressions to backend
  const sendExpressions = async (expressions) => {
    try {
      const response = await fetch("http://localhost:8000/detect_emotion/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expressions }),
      });
      const data = await response.json();
      // Update state instead of console.log
      setDetectedEmotion(data.detected_emotion);
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error("Error sending expressions to backend:", err);
    }
  };

  // Detect faces and expressions in real-time
  const handleVideoPlay = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    detectionIntervalRef.current = setInterval(async () => {
      if (capturing) return;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        const topEmotion = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        if (expressions[topEmotion] > 0.8) {
          setCapturing(true);
          await sendExpressions(expressions);
          setCapturing(false);
        }
      }
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold mb-6">Please log in</h1>
        <p>You must be signed in to access emotion-based recommendations.</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full py-10 px-4"
      style={{
        background: 'linear-gradient(135deg, #1E3C72, #2A5298)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white text-center drop-shadow-lg">
          Emotion Detection
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center mb-10">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              width="640"
              height="480"
              onPlay={handleVideoPlay}
              className="rounded-lg shadow-2xl"
            />
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="absolute top-0 left-0 rounded-lg"
            />
          </div>
        </div>

        {/* Display detected emotion and recommendations */}
        {detectedEmotion && (
          <div className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                Detected Emotion: <span className="text-yellow-300 capitalize">{detectedEmotion}</span>
              </h2>
              <h3 className="text-2xl font-semibold text-white mt-4 mb-6">Movies:</h3>
            </div>
            
            {/* Movie cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendations.map((movie, index) => (
                <div
                  key={index}
                  className="bg-[#1e3a8a] rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                  style={{
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(30, 58, 138, 0.5)'
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white font-semibold text-center text-lg">
                      {movie}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CameraPage;
