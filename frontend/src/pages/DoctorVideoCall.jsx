import { useParams } from "react-router-dom";
import VideoCall from "../CommanComponents/VideoCall";

const CallPage = () => {
  const { roomId } = useParams();

  return (
    <div>
      <h2>Video Call Room: {roomId}</h2>
   <VideoCall roomId={roomId} userType="doctor" />
    </div>
  );
};

export default CallPage;
