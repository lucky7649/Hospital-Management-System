import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import { BiLoaderCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { MdOutlineMicNone, MdOutlineMicOff } from "react-icons/md";
import { IoVideocamOffOutline, IoVideocamOutline } from "react-icons/io5";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { MdIosShare } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import Draggable from "react-draggable";
import toast from "react-hot-toast";
import { HashLoader, BounceLoader } from "react-spinners";
import VideoCallTimer from "../components/CommanComponents/VideoCallTimer";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isReceiving, setIsReceiving] = useState(false);
  const [isStreamSent, setIsStreamSent] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callEnded, setCallEnded] = useState(false);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [role, setRole] = useState(null);
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(true);
  const [showPopup, setShowPopup] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);


useEffect(() => {
  const storedRole = localStorage.getItem("role"); 
  if (storedRole) {
    setRole(storedRole);
  }
}, []); 




  const navigate = useNavigate();

  const handleUserJoined = useCallback(({ id }) => {
    console.log(`User joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    try {
      if (!remoteSocketId) {
        console.error("Remote Socket ID is missing!");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);

      if (!peer || !peer.getOffer) {
        console.error("Peer connection not initialized!");
        return;
      }

      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocketId, offer });
       socket.emit("call-started", remoteSocketId); 
       setShowPopup(false);
      setIsCallStarted(true);
      setIsCallActive(true);
    } catch (error) {
      console.error("Error in handleCallUser:", error);
    }
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      setIsReceiving(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );
  const toggleVideo = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
         socket.emit("video:toggled", { to: remoteSocketId, isOn: track.enabled });
      
        if (track.enabled) {
        toast.success("Video Turned ON ");
      } else {
        toast.success("Video Turned OFF");
      }
  
      });
      setIsVideoOn((prev) => !prev);
    }
  };

  const toggleAudio = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioOn;

          if (track.enabled) {
            toast.success("Audio Turned ON ");
          } else {
            toast.error("Audio Turned OFF ");
          }
      });
      setIsAudioOn((prev) => !prev);
    }
  };


  const sendStreams = useCallback(() => {
    if (!myStream) {
      toast.error("No stream available to share!");
      return;
    }

    try {
      myStream.getTracks().forEach((track) => {
        peer.peer.addTrack(track, myStream);
      });

      setIsStreamSent(true);
      toast.success("Sharing your Stream");
    } catch (error) {
      toast.error("Failed to share the stream ");
      console.error("Stream sharing error:", error);
    }
  }, [myStream]);

    useEffect(() => {
      if (isCallStarted) {
        setShowPopup(false);
      }
    }, [isCallStarted]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

useEffect(() => {
  const handleTrackEvent = (ev) => {
    const incomingStream = ev.streams[0]; // Get the first media stream
    console.log("GOT TRACKS!!", incomingStream);

    if (incomingStream) {
      setRemoteStream(incomingStream);

      // Check if video track exists
      const videoTrack = incomingStream.getVideoTracks()[0];
      setIsRemoteVideoOn(videoTrack ? videoTrack.enabled : false);

      if (videoTrack) {
        videoTrack.onmute = () => setIsRemoteVideoOn(false);
        videoTrack.onunmute = () => setIsRemoteVideoOn(true);
      }
    }
  };

  peer.peer.addEventListener("track", handleTrackEvent);

  return () => {
    peer.peer.removeEventListener("track", handleTrackEvent); // Cleanup when unmounting
  };
}, []);


const handleEndCall = useCallback(() => {
  if (myStream) {
    myStream.getTracks().forEach((track) => {
      track.stop(); 
    });
    setMyStream(null);
  }
  if (remoteStream) {
    remoteStream.getTracks().forEach((track) => {
      track.stop(); 
    });
    setRemoteStream(null);
  }


  setIsVideoOn(false);
  setIsAudioOn(false);
  setIsCallActive(false);

  setCallEnded(true);


  if (peer.peer) {
    peer.peer.close();
  }

 
  socket.emit("call:ended", { to: remoteSocketId });


  setRemoteSocketId(null);


  if (role === "doctor") {
    navigate("/doctor-dashboard");
  } else {
    navigate("/patient-dashboard");
  }
}, [myStream, remoteStream, remoteSocketId, socket, role, navigate]);


  useEffect(() => {
    socket.on("call:ended", () => {
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        setRemoteStream(null);
      }
      peer.peer.close();
      setRemoteSocketId(null);
    });

    return () => {
      socket.off("call:ended");
    };
  }, [socket, remoteStream]);





  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("call:ended", () => {
      setCallEnded(true);
      setIsCallActive(false);
     });
     socket.on("video:toggled", ({ isOn }) => {
       setIsRemoteVideoOn(isOn);
     });
     socket.on("call-started", () => {
       setShowPopup(false);
       setIsCallActive(true);
     });
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
         socket.off("video:toggled");
      socket.off("call:ended");
      socket.off("call-started");
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    handleEndCall,
  ]);

  return (
    <div className="flex flex-col items-center h-full bg-gray-100 text-gray-900 p-4">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-30 h-screen backdrop-blur-sm z-10">
          {/* Centered Popup */}
          <div className=" z-20 bg-white shadow-lg rounded-xl p-6 w-1/4 text-center">
            <h1 className="text-3xl font-bold mb-4 text-blue-600">
              Video Call
            </h1>
            {remoteSocketId ? (
              <div className="flex flex-col gap-2 justify-center">
                <h4 className="text-lg text-green-600 transition-all animate-fade-in">
                  ✅ Connected to participant
                </h4>
                {remoteSocketId && !isReceiving && !isCallStarted && (
                  <button
                    className="px-6 py-2 flex gap-2 items-center self-center bg-green-100 hover:bg-green-200 text-green-500 font-semibold rounded-lg shadow"
                    onClick={handleCallUser}
                  >
                    <MdOutlinePhoneInTalk /> Call
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <h4 className="text-lg text-gray-600 animate-pulse">
                  Waiting for participant...
                </h4>
                <BounceLoader color="#0076be" />
              </div>
            )}
          </div>
        </div>
      )}
      <VideoCallTimer isCallStarted={isCallActive} />
      <div className="relative flex flex-col w-full max-w-5xl bg-white p-4 rounded-3xl shadow-lg">
        {/* Remote Stream (Bigger and on top) */}
        <div className="relative w-full h-[300px] md:h-[500px] bg-black rounded-xl md:rounded-3xl overflow-hidden">
          {remoteStream && isRemoteVideoOn ? (
            <ReactPlayer
              playing
              className="rounded-lg"
              height="100%"
              width="100%"
              url={remoteStream}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center">
                <FaRegUser size={40} />
                </div>
                
            </div>
          )}
          <span className="absolute bottom-2 left-2 bg-gray-800 text-white text-sm px-2 py-1 rounded-md">
            Remote
          </span>
        </div>
        <Draggable>
        <div className="self-center m-2 flex gap-4 p-2  rounded-full bg-gray-200">
        

          {myStream && (
            <>
              {/* Video Toggle Button */}
              <button
                className={`p-3 text-xl font-semibold rounded-full shadow ${
                  isVideoOn
                    ? "bg-green-100 hover:bg-green-200 text-green-500" // Video ON
                    : "bg-red-100 hover:bg-red-200 text-red-500" // Video OFF
                }`}
                onClick={toggleVideo}
              >
                {isVideoOn ? <IoVideocamOutline /> : <IoVideocamOffOutline />}
              </button>

              {/* Mic Toggle Button */}
              <button
                className={`p-3 text-xl font-semibold rounded-full shadow ${
                  isAudioOn
                    ? "bg-green-100 hover:bg-green-200 text-green-500" // Mic ON
                    : "bg-red-100 hover:bg-red-200 text-red-500" // Mic OFF
                }`}
                onClick={toggleAudio}
              >
                {isAudioOn ? <MdOutlineMicNone /> : <MdOutlineMicOff />}
              </button>

            
              <button
                className="p-3 text-lg flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-500 font-semibold rounded-full shadow"
                onClick={handleEndCall}
              >
                <FiLogOut /> <span className="hidden md:block">Leave</span> 
              </button>
            </>
            )}
            {isReceiving && myStream && !isStreamSent && (
            <button
              className="p-3 text-xl md:text-base  flex gap-2 items-center bg-blue-100 hover:bg-blue-200 text-blue-500 font-semibold rounded-full shadow"
              onClick={sendStreams}
            >
              <MdIosShare /> <span className="hidden md:block">Send Stream</span>
            </button>
          )}
        </div>
</Draggable>
        <Draggable>
          <div className="relative w-1/3 h-[100px] cursor-grab md:h-[200px] bg-black rounded-xl md:rounded-3xl overflow-hidden mt-4 self-start">
            {myStream && isVideoOn ? (
              <ReactPlayer
                playing
                muted
                className="rounded-lg"
                height="100%"
                width="100%"
                url={myStream}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center">
                  <FaRegUser size={30} />
                </div>
              </div>
            )}
            <span className="absolute bottom-2 left-2 bg-gray-800 text-white text-sm px-2 py-1 rounded-md">
              You
            </span>
          </div>
        </Draggable>

        
      </div>
    </div>
  );
};

export default RoomPage;
