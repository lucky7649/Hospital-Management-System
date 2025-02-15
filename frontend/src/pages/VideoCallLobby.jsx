import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { toast } from "react-hot-toast";

const LobbyScreen = () => {
  const params = useParams();
  console.log("Params from URL:", params);

  const [room, setRoom] = useState(params.roomId || "");
  const socket = useSocket();
  const navigate = useNavigate();

  // ✅ Check if Camera and Microphone Devices are Available
  const checkMediaDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideo = devices.some((device) => device.kind === "videoinput");
    const hasAudio = devices.some((device) => device.kind === "audioinput");

    return hasVideo && hasAudio;
  };

  // ✅ Check if Permissions are Granted
  const checkPermissions = async () => {
    try {
      const camera = await navigator.permissions.query({ name: "camera" });
      const mic = await navigator.permissions.query({ name: "microphone" });

      return camera.state === "granted" && mic.state === "granted";
    } catch (error) {
      return false; // Handle browsers that don’t support `navigator.permissions`
    }
  };

  // ✅ Combined Check for Devices & Permissions
const isMediaAvailable = async () => {
  try {
    // ✅ Check if devices exist
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideo = devices.some((device) => device.kind === "videoinput");
    const hasAudio = devices.some((device) => device.kind === "audioinput");

    if (!hasVideo || !hasAudio) {
      toast.error("No Camera or Microphone detected!");
      return false;
    }

    // ✅ Check permissions without starting the camera
    const cameraPermission = await navigator.permissions
      .query({ name: "camera" })
      .catch(() => null);
    const micPermission = await navigator.permissions
      .query({ name: "microphone" })
      .catch(() => null);

    const isCameraAllowed = cameraPermission?.state === "granted";
    const isMicAllowed = micPermission?.state === "granted";

    if (!isCameraAllowed || !isMicAllowed) {
      toast.error("Please allow Camera and Microphone permissions!");
      return false;
    }

    return true;
  } catch (error) {
    toast.error("Error checking media permissions!");
    return false;
  }
};



  // ✅ Handle Room Join
  const handleSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      const canJoin = await isMediaAvailable();

      if (!canJoin) return;

      console.log("Emitting room:join with Room ID:", room);
      socket.emit("room:join", { room });
    },
    [room, socket]
  );

  // ✅ Handle Room Navigation on Join
  const handleJoinRoom = useCallback(
    (data) => {
      console.log("Navigating to:", `/video-call/${data.room}`);
      navigate(`/video-call/${data.room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="flex items-center justify-center h-[80vh] bg-gray-100 text-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center border border-gray-300">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          Join Video Consultation
        </h1>
        <p className="text-gray-600 mb-6">
          Ready to join? Click the button below.
        </p>
        <form onSubmit={handleSubmitForm} className="">
          <div className="hidden">
            <input
              type="text"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full p-2 mt-1 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Room ID"
              readOnly
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white py-2 rounded-md font-medium"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default LobbyScreen;

