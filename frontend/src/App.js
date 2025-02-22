
import Footer from "./components/CommanComponents/Footer";
import Navbar from "./components/CommanComponents/Navbar";
import AllDoctors from './pages/AllDoctors';
// import BookAppointment from './pages/BookAppointment';
import Home from './pages/Home';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import DoctorProfile from "./components/DoctorDashboardLinks/DoctorProfile";
import BedOccupancy from "./components/CommanComponents/BedChecking";
import BedDetails from "./components/CommanComponents/BedDetails";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { authActions } from './store/auth';
import { Toaster } from "react-hot-toast";
import PatientDashboard from './pages/PatientsDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from "./pages/DoctorDashboard";

import GoogleTranslate from "./components/GoogleTranslate/GoogleTranslate";

import ForgetPassword from "./components/CommanComponents/forgetPassword";
import ResetPassword from "./components/CommanComponents/resetPassword";
import LanguageSelector from './components/GoogleTranslate/languageSelector';
import RoomPage from './pages/VideoRoom';
import LobbyScreen from './pages/VideoCallLobby';
import { ActiveSectionProvider } from './context/ActiveSectionContext';
import SidePannelChatBot from './components/CommanComponents/SidePannelChatBot';
import { SidePanelProvider } from './context/sidePannelContext';



function App() {

  const dispatch = useDispatch();
  // const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
    }
  },[dispatch])

  return (
    <div className="">
      <Toaster />
      <GoogleTranslate />
      <SidePanelProvider>
<ActiveSectionProvider>
        <Navbar />
        <SidePannelChatBot/>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/all-doctors" element={<AllDoctors />} />

        {/* <Route path="/book-appointment" element={<BookAppointment />} /> */}
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/check-bed-availability" element={<BedOccupancy />} />
        <Route
          path="/view-bed-details/:roomId/:bedId"
          element={<BedDetails />}
        />
        <Route path="/view-doctor-details/:id" element={<DoctorProfile />} />

        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/video-call/:roomId" element={<RoomPage />} />
        <Route path="/video-call-lobby/:roomId" element={<LobbyScreen/>} />

        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/LogIn" element={<LogIn />} />
      </Routes>
        <Footer />
        </ActiveSectionProvider>
      </SidePanelProvider>
    </div>
  );
}

export default App;
