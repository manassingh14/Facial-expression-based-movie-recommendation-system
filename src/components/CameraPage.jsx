import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";

const CameraPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState(""); // New state
  const [recommendations, setRecommendations] = useState([]); // New state

  // Load models once when component mounts
  useEffect(() => {
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
  }, []);

  // Start webcam video
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
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

    setInterval(async () => {
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

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold mb-6">Emotion Detection</h1>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          width="640"
          height="480"
          onPlay={handleVideoPlay}
          className="rounded-lg shadow-lg"
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          className="absolute top-0 left-0"
        />
      </div>

      {/* Display detected emotion */}
      {detectedEmotion && (
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold">
            Detected Emotion: {detectedEmotion}
          </h2>
          <h3 className="text-lg font-medium mt-2">Movie Recommendations:</h3>
          <ul className="list-disc list-inside mt-1">
            {recommendations.map((movie, index) => (
              <li key={index}>{movie}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CameraPage;
