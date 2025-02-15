import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

const VideoCall = ({ roomId, userType }) => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const userVideo = useRef();
  const remoteVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      setStream(mediaStream);
      userVideo.current.srcObject = mediaStream;
      socket.emit("join-room", { roomId });
    });

    socket.on("user-joined", ({ socketId }) => {
      if (userType === "doctor") startCall(socketId);
    });

    socket.on("incoming-call", ({ from, offer }) => {
      const peer = new Peer({ initiator: false, trickle: false, stream });
      peer.signal(offer);
      peer.on("signal", (answer) => socket.emit("answer-call", { to: from, answer }));
      peer.on("stream", (remoteStream) => {
        remoteVideo.current.srcObject = remoteStream;
      });
    });

  }, [roomId]);

  const startCall = (socketId) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (offer) => socket.emit("call-user", { to: socketId, offer }));
    peer.on("stream", (remoteStream) => {
      remoteVideo.current.srcObject = remoteStream;
    });
  };

  return (
    <div>
      <video ref={userVideo} autoPlay playsInline />
      <video ref={remoteVideo} autoPlay playsInline />
    </div>
  );
};

export default VideoCall;
