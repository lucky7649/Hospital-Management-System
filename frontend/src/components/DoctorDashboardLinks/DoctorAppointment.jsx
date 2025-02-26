import React, { useState, useEffect } from "react";
import { AiFillSchedule, AiOutlineFileSearch } from "react-icons/ai";
import { FaUser } from "react-icons/fa6";
import { HiUser } from "react-icons/hi2";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaEllipsisH, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import PrescriptionForm from "../DoctorDashboardLinks/PrescriptionForm";
import { useNavigate } from "react-router-dom";

const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifiedPatients, setNotifiedPatients] = useState(new Set());
  const [activeTab, setActiveTab] = useState("in-person");


  const patientId = selectedPatient;
  const doctorId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const doctorId = localStorage.getItem("userId");
      if (!doctorId) {
        console.error("No doctor ID found in local storage");
        setError("Doctor ID not found. Please log in again.");
        return;
      }

      const headers = {
        id: doctorId,
        authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.get(
        `${apiUrl}/api/v1/appointments/${doctorId}`,
        { headers }
      );

      if (response.data && response.data.data) {
      
        setAppointments(response.data.data);
      } else {
        console.error("Unexpected response structure:", response.data);
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);




  

  const handleRefresh = async () => {
    await fetchAppointments(); // Ensure appointments are fresh

    const currentIndex = appointments.findIndex(
      (appointment) => appointment._id === selectedAppointment
    );

    // Check if the currentIndex is valid, and then select the next patient
    if (currentIndex !== -1 && currentIndex < appointments.length - 1) {
      const nextAppointment = appointments[currentIndex + 1];
      setSelectedPatient(nextAppointment.patientId);
      setSelectedAppointment(nextAppointment._id);
    } else {
      // If there's no next appointment, reset to null or handle as needed
      setSelectedPatient(null);
      setSelectedAppointment(null);
    }
  };

  const handleRefreshAndSendSMS = async () => {
    const currentIndex = appointments.findIndex(
      (appointment) => appointment._id === selectedAppointment
    );

    if (currentIndex !== -1 && currentIndex < appointments.length - 1) {
      const nextAppointment = appointments[currentIndex + 2]; // Get the next appointment

      if (nextAppointment) {
        setSelectedPatient(nextAppointment.patientId);
        setSelectedAppointment(nextAppointment._id);

        if (
          nextAppointment.status.toLowerCase() === "pending" &&
          !notifiedPatients.has(nextAppointment._id)
        ) {
          const message = `Hello ${nextAppointment.patientId.name}, your appointment is up. Please proceed to the consultation.`;
          try {
            await axios.post(`${apiUrl}/api/v1/send-sms`, {
              phoneNumber: nextAppointment.patientId.phone,
              message,
            });
            console.log("SMS sent to the next patient");

            // Mark patient as notified
            setNotifiedPatients(
              (prevSet) => new Set(prevSet.add(nextAppointment._id))
            );
          } catch (error) {
            console.error("Error sending SMS:", error);
          }
        } else if (notifiedPatients.has(nextAppointment._id)) {
          console.log("SMS already sent to this patient.");
        } else {
          console.log("Next patient is not in 'waiting' status. No SMS sent.");
        }
      } else {
        console.log("No valid next appointment found.");
        setSelectedPatient(null);
        setSelectedAppointment(null);
      }
    } else {
      console.log(
        "No next appointment available or selected appointment not found."
      );
      setSelectedPatient(null);
      setSelectedAppointment(null);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-solid rounded-full border-current border-t-transparent text-blue-600"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
      const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };


  const today = new Date();
  const todaysAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  });

  const PendingAppointments = todaysAppointments.filter(
    (appointment) => appointment.status.toLowerCase() === "pending"
  ).length;

  const totalAppointments = todaysAppointments.length;

  const CompletedAppointments = todaysAppointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;

  const onlineAppointments = todaysAppointments.filter(
    (appointment) => appointment.mode === "online"
  ).length;

  const offlineAppointments = todaysAppointments.filter(
    (appointment) => appointment.mode === "in-person"
  ).length;

  const handleStartCall = (roomId) => {
    navigate(`/video-call/${roomId}`);
  };

  const analyticsCards = [
    {
      title: "Total Appointments",
      value: totalAppointments,

      icon: <HiUser />, // Replace with your preferred icon or SVG
      bgColor: "bg-purple-100",
      iconColor: "text-purple-500",

      borderColor: "border-purple-500",
    },
    {
      title: "Online Appointments",
      value: onlineAppointments,

      icon: <FaUser />,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",

      borderColor: "border-blue-500",
    },
    {
      title: "In-Person Appointments",
      value: offlineAppointments,

      icon: <AiFillSchedule />, // Replace with your preferred icon or SVG

      bgColor: "bg-green-100",
      iconColor: "text-green-500",

      borderColor: "border-green-500",
    },

    {
      title: "Pending Appointments",
      value: PendingAppointments,

      icon: <MdOutlinePendingActions />, // Replace with your preferred icon or SVG
      bgColor: "bg-orange-100",
      iconColor: "text-orange-500",

      borderColor: "border-orange-500",
    },
  ];

  const handelAppointmentComplete = async (appointmentId) => {
    try {
      const headers = {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      // Make the API request to update the status of the selected appointment
      const response = await axios.put(
        `${apiUrl}/api/v1/update-appointment/${selectedAppointment}`,
        { status: "completed" }, // You can send the status here, or just update on the server side
        { headers }
      );

      if (response.status === 200) {
        console.log("Appointment marked as completed");
        toast.success("Consultation Done!");
        handleRefresh();
      } else {
        console.error("Failed to mark appointment as completed");
      }
    } catch (error) {
      console.error("Error in updating appointment:", error);
    }
  };
  return (
    <div className="flex gap-2 h-full bg-gray-100 ">
      {/* Left Sidebar */}
      <div className="w-[400px] bg-gray-50 border-r p-4 overflow-y-auto ">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg md:text-2xl font-semibold text-blue-500">
            Statactics
          </h2>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 gap-4">
          {analyticsCards.map((card, index) => (
            <div
              key={index}
              className={`p-4 ${card.bgColor}  border-l-4 ${card.borderColor} rounded-lg shadow-sm`}
            >
              <div className="flex justify-between items-center h-5">
                <h3 className="text-xs font-medium text-gray-700">
                  {card.title}
                </h3>
                <span className={`text-xl ${card.iconColor}`}>{card.icon}</span>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-2 items-center justify-between  mt-4 mb-4">
          <h2 className="text-xl text-blue-500 font-semibold ">
            Patient Queue
          </h2>
          <div className="flex gap-2">
            <button
              className={`px-2 py-2 rounded text-sm font-semibold ${
                activeTab === "in-person"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => setActiveTab("in-person")}
            >
              In-Person
            </button>
            <button
              className={`px-2 py-2 rounded text-sm font-semibold ${
                activeTab === "online"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => setActiveTab("online")}
            >
              Online
            </button>
          </div>
        </div>
        <div className="w-full h-[45vh] border-2 rounded-lg border-gray-300 overflow-y-scroll p-2 bg-gray-100">
          {appointments.length > 0 ? (
            appointments
              .filter((appointment) => {
                const appointmentDate = new Date(appointment.appointmentDate);
                const today = new Date();
                return (
                  appointment?.status === "Pending" &&
                  appointment?.mode === activeTab &&
                  appointmentDate.getDate() === today.getDate() &&
                  appointmentDate.getMonth() === today.getMonth() &&
                  appointmentDate.getFullYear() === today.getFullYear()
                );
              })
              .map((appointment, idx) => (
                <div
                  key={idx}
                  className="flex flex-col bg-white shadow-md mb-3 rounded-lg p-4 space-y-3 hover:shadow-lg transition duration-300"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-green-200 text-green-600 rounded-lg">
                        <p className="text-sm font-semibold">#{idx + 1}</p>
                      </div>
                      <Avatar
                        name={appointment?.patientName}
                        src={appointment?.patientId?.profileImg}
                        round={true}
                        size="40"
                        className="shadow-sm"
                      />
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-700">
                          {appointment?.patientName || "Unknown"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {appointment?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEllipsisH />
                    </button>
                  </div>

                  {/* Reason for Visit and Age */}
                  <div className="text-gray-600">
                    <p>
                      <span className="font-semibold">Reason for Visit:</span>{" "}
                      {appointment?.reasonForVisit || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold">Age:</span>{" "}
                      {appointment?.patientAge || "N/A"}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          appointment?.status === "completed"
                            ? "bg-green-100 text-green-600 border border-green-500"
                            : "bg-yellow-100 text-yellow-600 border border-yellow-500"
                        }`}
                      >
                        {appointment?.status || "Pending"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          appointment?.mode === "online"
                            ? "bg-green-100 text-green-500 border border-green-500"
                            : "bg-blue-100  text-blue-500 border border-blue-500"
                        }`}
                      >
                        {appointment?.mode || "in-person"}
                      </span>
                      {appointment?.mode === "online" ? (
                        <button
                          onClick={() =>
                            navigate(`/video-call-lobby/${appointment?.roomId}`)
                          }
                          className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-500 text-white"
                        >
                          Start Call
                        </button>
                      ) : (
                        <p></p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPatient(appointment?.patientId);
                        setSelectedAppointment(appointment._id);
                      }}
                      className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="w-full h-[40vh] text-gray-400 flex items-center justify-center flex-col gap-2">
              <AiOutlineFileSearch size={70} />
              <p className="text-center text-gray-500">No Appointments Found</p>
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 relative   p-2">
        <div className="w-full h-fit px-6 py-2 rounded-lg bg-white">
          <h1 className="text-2xl text-blue-500 font-semibold mb-3">
            Patient Details
          </h1>
          {!selectedPatient ? (
            <div className="w-full h-[70vh] text-gray-400 flex items-center justify-center flex-col gap-2">
              <img
                src="/assets/doctor-appointments.jpg"
                alt=""
                className="w-1/2"
              />
              <p className="text-center text-gray-500">
                No Appointments Selected
              </p>
            </div>
          ) : (
            <div className="p-2 bg-gray-50 h-[70vh] overflow-y-scroll rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4 items-start">
                  <Avatar
                    name={selectedPatient?.name}
                    src={selectedPatient?.profileImg}
                    className="rounded-lg object-contain bg-white  border border-gray-300"
                    size="70"
                  />

                  <div>
                    <h1 className="text-2xl font-bold">
                      {selectedPatient?.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {selectedPatient?.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {["envelope", "phone", "video"].map((icon, idx) => (
                    <button
                      key={idx}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    ></button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="font-semibold text-lg mb-3">
                    Basic Information
                  </h2>
                  <ul>
                    {[
                      { label: "Gender", value: selectedPatient.gender },
                      {
                        label: "DOB",
                        value: formatDate(selectedPatient.dateOfBirth),
                      },
                      { label: "Age", value: selectedPatient?.age },
                      { label: "Phone", value: selectedPatient?.phone },
                      { label: "Email", value: selectedPatient.email },
                      { label: "City", value: selectedPatient.city },
                      { label: "State", value: selectedPatient.state },
                      { label: "Country", value: selectedPatient.country },
                     
          
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center justify-start">
                        <span className="text-blue-500 font-semibold">
                          {item.label}:
                        </span>
                        <span className="ml-2">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Appointment Schedule */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="font-semibold text-lg mb-3">
                    Appointment Schedule
                  </h2>
                  <ul>
                    {[
                      {
                        title: "Prosthetic Tooth Fabrication",
                        date: "12 Oct 2023",
                      },
                      { title: "Post-Surgical Care", date: "12 Sep 2023" },
                      { title: "Implant Placement", date: "12 Aug 2023" },
                    ].map((appointment, idx) => (
                      <li key={idx} className="mb-2">
                        <p className="font-medium">{appointment.title}</p>
                        <span className="text-sm text-gray-500">
                          {appointment.date}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2 w-full">
                  <PrescriptionForm
                    patientId={patientId}
                    doctorId={doctorId}
                    selectedPatient={selectedPatient}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="  w-full  border-t border-gray-300 p-2 flex justify-around">
            <button
              onClick={() => {
                handelAppointmentComplete();
                handleRefresh();
                handleRefreshAndSendSMS();
              }}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Completed
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded">
              Skip
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;
