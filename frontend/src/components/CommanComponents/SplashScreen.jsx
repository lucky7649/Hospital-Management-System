import React, { useState, useEffect } from "react";
import { HashLoader } from "react-spinners";

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [throwSplash, setThrowSplash] = useState(false);

  useEffect(() => {
    // Hide the splash screen after 2 seconds
    const timer = setTimeout(() => {
      setThrowSplash(true); // Trigger the animation to "throw" the splash screen up
    }, 2000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, []);

  // Split the text into individual letters
  const text = "YASH TUPKAR";
  const letters = text.split("");

  return (
    <div
      className={`fixed inset-0 bg-blue-500 flex items-center justify-center z-50 transition-all duration-1000 ${
        showSplash ? "opacity-100" : "opacity-0"
      } ${throwSplash ? "transform -translate-y-full opacity-0" : ""}`}
    >
      <HashLoader color="#ffffff" />
    </div>
  );
};

export default SplashScreen;
