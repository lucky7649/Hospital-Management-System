import { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "react-avatar";
import Calendar from "../CommanComponents/Calendar";
import { useNavigate } from "react-router-dom";
import { AiOutlineFileSearch } from "react-icons/ai";


export default function AppointmentsPage() {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  const navigate = useNavigate();




  useEffect(() => {
    const fetchUser = async () => {
      try {
        const headers = {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const response = await axios.get(
          `${apiUrl}/api/v1/get-user-information`,
          { headers }
        );

        const userData = response.data.data;
        setUser(userData);
        console.log(userData);

        if (userData?.appointments?.length) {
          fetchAppointments(userData._id);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();

  }, []);

    const [openDropdown, setOpenDropdown] = useState(null);

  const fetchAppointments = async (userId) => {
    try {
      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.get(
        `${apiUrl}/api/v1/find-patient-appointments/${userId}`,
        { headers }
      );

      const appointmentsData = response.data.data;

      const appointmentsWithDoctors = await Promise.all(
        appointmentsData.map(async (appointment) => {
          if (!appointment.doctorId) return appointment;

          try {
            const doctorResponse = await axios.get(
              `${apiUrl}/api/v1/get-staff/${appointment.doctorId}`,
              { headers }
            );

            return { ...appointment, doctor: doctorResponse.data.data };
          } catch (error) {
            console.error(
              `Error fetching doctor details for ${appointment.doctorId}:`,
              error
            );
            return { ...appointment, doctor: null };
          }
        })
      );

      setAppointments(appointmentsWithDoctors);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };
 

const handleCancelAppointment = (appointmentId) => {
  const headers = {
    "Content-Type": "application/json",
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  if (window.confirm("Are you sure you want to cancel this appointment?")) {
    axios
      .put(
        `${apiUrl}/api/v1/update-appointment/${appointmentId}`,
        {
          status: "Cancelled",
        },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          alert("Appointment status updated to cancelled.");
          // Optionally update your state to reflect the change in the UI
        } else {
          alert("Failed to update appointment status.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while cancelling the appointment.");
      });
  }
};


      const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Ensures AM/PM format
    });
  };

    const [activeTab, setActiveTab] = useState("Upcoming");

    const filteredAppointments = appointments.filter((appt) => {
      if (activeTab === "Upcoming")
        return appt?.status.toLowerCase() === "pending";
      if (activeTab === "Pending")
        return appt?.status.toLowerCase() === "pending";
      if (activeTab === "Completed")
        return appt?.status.toLowerCase() === "completed";
      if (activeTab === "Cancelled")
        return appt?.status.toLowerCase() === "cancelled";
      return true;
    });
  return (
    <div className="p-6 flex flex-col-reverse md:flex-row gap-4 w-full mx-auto">
      <div className="w-full">
        <h1 className="text-xl md:text-2xl font-bold">My Appointments</h1>
        <p className="text-gray-500 text-sm md:text-base">
          See your scheduled appointments from your calendar.
        </p>

        <div className="flex space-x-2 mt-4">
          {["Upcoming", "Pending", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 md:px-4 py-1 md:py-2 text-sm md:text-base rounded ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6 p-2 md:p-4 bg-white shadow-lg rounded-lg">
          <div className="hidden md:block overflow-x-auto md:h-[65vh]">
            <h1 className="font-semibold text-gray-500 text-lg mb-4">
              {activeTab} Appointments
            </h1>

            {filteredAppointments.length > 0 ? (
              filteredAppointments
                .sort(
                  (a, b) =>
                    new Date(b.appointmentDate).getTime() -
                    new Date(a.appointmentDate).getTime()
                )
                .map((appt, index) => (
                  <div
                    key={index}
                    className="w-full  p-4 border-b border-gray-300  flex flex-col md:flex-row items-center gap-4"
                  >
                    <Avatar
                      src={appt?.doctor?.profileImg}
                      alt={appt?.doctor?.name}
                      className=" object-cover rounded-lg "
                      size="150"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">
                        {appt?.doctor?.name}
                      </h2>
                      <p className="text-gray-500">
                        {appt?.doctor?.specialization}
                      </p>
                      <p className="text-gray-600 mt-1">
                        <span className="font-semibold">Time slot:</span>{" "}
                        {appt?.timeSlot}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Appointment Date:{" "}
                        </span>
                        {formatDate(appt.appointmentDate)}
                      </p>
                      <p
                        className={`text-sm font-medium mt-2 inline-block px-3 py-1 rounded-full ${
                          appt?.status.toLowerCase() === "scheduled"
                            ? "bg-green-100 text-green-500  border border-green-500"
                            : appt?.status.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-500  border border-yellow-500"
                            : appt?.status.toLowerCase() === "completed"
                            ? "bg-gray-200 text-gray-500  border border-gray-500"
                            : "bg-red-100 text-red-500  border border-red-500"
                        }`}
                      >
                        {appt?.status}
                      </p>
                      <p
                        className={`text-sm ml-2  font-medium mt-2 inline-block px-3 py-1 rounded-full ${
                          appt?.mode.toLowerCase() === "online"
                            ? "bg-green-100 text-green-500 border border-green-500"
                            : "bg-blue-100 text-blue-500  border border-blue-500"
                        }`}
                      >
                        {appt?.mode}
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col h-full items-start justify-start">
                      <h1 className="text-xl text-gray-500 mb-2">
                        Patient Info
                      </h1>

                      <p>
                        <span className="font-medium text-gray-600">
                          Name:{" "}
                        </span>
                        {appt?.patientId?.name}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Age: </span>
                        {appt?.patientId?.age}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Gender:{" "}
                        </span>
                        {appt?.patientId?.gender}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Reason for Visit:{" "}
                        </span>
                        {appt?.reasonForVisit}
                      </p>
                    </div>
                    <div className="mt-4 w-1/5 space-y-2">
                      {appt.mode === "online" && (
                        <button
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition duration-200"
                          onClick={() =>
                            navigate(`/video-call-lobby/${appt.roomId}`)
                          }
                        >
                          Join Call
                        </button>
                      )}
                      <button className="w-full   text-gray-600 border hover:bg-green-100 hover:border-green-500 hover:text-green-500 border-gray-300 py-2 rounded-md transition duration-200">
                        Pay Online
                      </button>

                      <button
                        onClick={() => handleCancelAppointment(appt._id)}
                        className="w-full border border-gray-300 text-gray-600 py-2 rounded-md hover:bg-red-100 hover:border-red-500 hover:text-red-500 transition duration-200"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="w-full h-[40vh] text-gray-400 flex items-center justify-center flex-col gap-2">
                <AiOutlineFileSearch size={70} />
                <p className="text-center text-gray-500">
                  No Appointments Found
                </p>
              </div>
            )}
          </div>

          {/* Show cards on smaller screens */}
          <div className="md:hidden">
            <h1 className="font-semibold mt-2 mb-4">
              {activeTab} Appointments
            </h1>
            {filteredAppointments.length > 0 ? (
              filteredAppointments
                .sort(
                  (a, b) =>
                    new Date(b.appointmentDate).getTime() -
                    new Date(a.appointmentDate).getTime()
                )
                .map((appt, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 bg-white shadow-md rounded-lg border border-gray-200"
                  >
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          name={appt?.doctor?.name}
                          src={appt?.doctor?.profileImg}
                          className="rounded-md shadow-md "
                          size="70"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {appt?.doctor?.name || "Unknown Doctor"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {appt?.doctor?.specialization || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            appt?.status.toLowerCase() === "scheduled"
                              ? "bg-green-100 text-green-500 border border-green-500"
                              : appt?.status.toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-500 border border-yellow-500"
                              : appt?.status.toLowerCase() === "completed"
                              ? "bg-gray-200 text-gray-500 border border-gray-500"
                              : "bg-red-100 text-red-500 border border-red-500"
                          }`}
                        >
                          {appt?.status}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs ${
                            appt.mode === "online"
                              ? "bg-green-100 text-green-500 border border-green-500"
                              : "bg-blue-100 text-blue-500 border border-blue-500"
                          }  rounded-full w-fit`}
                        >
                          {appt.mode}
                        </span>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="mt-3 space-y-2 text-gray-700 text-sm">
                      <p>
                        <span className="font-medium text-gray-600">
                          Appointment Date:{" "}
                        </span>
                        {formatDate(appt.appointmentDate)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      <div className="flex gap-2">
                        {appt.mode === "online" && (
                          <button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition duration-200"
                            onClick={() =>
                              navigate(`/video-call-lobby/${appt.roomId}`)
                            }
                          >
                            Join Call
                          </button>
                        )}
                        <button className="w-full   text-gray-600 border hover:bg-green-100 hover:border-green-500 hover:text-green-500 border-gray-300 py-2 rounded-md transition duration-200">
                          Pay Online
                        </button>
                      </div>
                      <button className="w-full border border-gray-300 text-gray-600 py-2 rounded-md hover:bg-red-100 hover:border-red-500 hover:text-red-500 transition duration-200">
                        Cancel Appointment
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="w-full h-[40vh] text-gray-400 flex items-center justify-center flex-col gap-2">
                <AiOutlineFileSearch size={70} />
                <p className="text-center text-gray-500">
                  No Appointments Found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
