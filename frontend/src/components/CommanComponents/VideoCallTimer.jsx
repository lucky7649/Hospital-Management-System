import React, { useState, useEffect, useRef } from "react";
import { MdOutlinePhoneCallback } from "react-icons/md";

const VideoCallTimer = ({ isCallStarted }) => {
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isCallStarted) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
      }
    } else {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTime(0); // Reset timer when call ends
    }

    return () => clearInterval(timerRef.current); // Cleanup on unmount
  }, [isCallStarted]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-100 text-gray-600 p-2 rounded-md shadow-md">
      <p className="text-lg flex gap-2 items-center font-semibold">
        <MdOutlinePhoneCallback /> {formatTime(time)}
      </p>
    </div>
  );
};

export default VideoCallTimer;
