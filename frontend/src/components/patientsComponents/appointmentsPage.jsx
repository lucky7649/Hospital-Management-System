import { useState, useEffect } from "react";
import { FiClock, FiMapPin, FiMoreVertical } from "react-icons/fi";
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
        return appt.status.toLowerCase() === "pending";
      if (activeTab === "Pending")
        return appt.status.toLowerCase() === "pending";
      if (activeTab === "Completed")
        return appt.status.toLowerCase() === "completed";
      if (activeTab === "Cancelled")
        return appt.status.toLowerCase() === "cancelled";
      return true;
    });
  return (
    <div className="p-6 flex flex-col-reverse md:flex-row gap-4 w-full mx-auto">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 h-[85vh] hidden md:block p-4 bg-gray-100 rounded-xl">
        <Calendar />
      </div>

      {/* Main Content */}
      <div className="w-full">
        <h1 className="text-xl md:text-2xl font-bold">My Appointments</h1>
        <p className="text-gray-500 text-sm md:text-base">
          See your scheduled appointments from your calendar.
        </p>

        {/* Tabs */}
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

        {/* Table */}
        <div className="mt-6 p-2 md:p-4 bg-white shadow-lg rounded-lg">
          {/* Show table on larger screens */}
          <div className="hidden md:block overflow-x-auto md:h-[65vh]">
            <h1 className="font-bold text-gray-500 text-2xl m-4">
              {activeTab} Appointments
            </h1>
            <table className="w-full min-w-max table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr className="text-left text-gray-500 text-sm">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Specialty</th>
                  <th className="py-3 px-4">Date and Time</th>
                  <th className="py-3 px-4">Facility</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">
                    <FiMoreVertical />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments
                    .sort(
                      (a, b) =>
                        new Date(b.appointmentDate).getTime() -
                        new Date(a.appointmentDate).getTime()
                    )
                    .map((appt, index) => (
                      <tr
                        key={index}
                      
                        className="border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="py-4 px-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              appt.status.toLowerCase() === "scheduled"
                                ? "bg-green-100 text-green-600"
                                : appt.status.toLowerCase() === "pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : appt.status.toLowerCase() === "completed"
                                ? "bg-gray-200 text-gray-500"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {appt?.doctor?.specialization || "N/A"}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          <p className="font-medium">
                            {formatDate(appt.appointmentDate)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(appt.createdAt)}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          <div
                            className={`font-semibold w-fit px-3 py-1 rounded-xl text-sm ${
                              appt.mode.toLowerCase() === "online"
                                ? "bg-green-200 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {appt.mode}
                          </div>
                        </td>
                        <td className="py-4 px-4 flex items-center space-x-3 text-sm">
                          <Avatar
                            name={appt?.doctor?.name}
                            src={`http://localhost:1000/uploads/${appt?.doctor?.profileImg}`}
                            className="rounded-xl shadow-sm "
                            size="60"
                          />
                          <div>
                            <p className="font-medium">
                              {appt?.doctor?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {appt?.doctor?.specialization || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="relative text-center">
                          {appt.mode === "online" ? (
                            <button
                              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
                              onClick={() =>
                                navigate(`/video-call-lobby/${appt.roomId}`)
                              }
                            >
                              Join Call
                            </button>):<FiMoreVertical onClick={()=>setOpenDropdown(true)}/>}
                          {openDropdown === index && (
                            <div className="absolute right-0 mt-2 z-50 w-48 bg-white shadow-lg rounded-lg p-2">
                              {[
                                "Reschedule booking",
                                "Request reschedule",
                                "Edit location",
                                "Invite people",
                                "Cancel event",
                              ].map((action) => (
                                <button
                                  key={action}
                                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="w-full h-[40vh] text-gray-400 flex items-center justify-center flex-col gap-2">
                        <AiOutlineFileSearch size={70} />
                        <p className="text-center text-gray-500">
                          No Appointments Found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Show cards on smaller screens */}
          <div className="md:hidden">
            <h1 className="font-semibold mt-2 mb-4">{activeTab} Appointments</h1>
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
                          src={`http://localhost:1000/uploads/${appt?.doctor?.profileImg}`}
                          className="rounded-xl shadow-md "
                          size="50"
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                          appt.status.toLowerCase() === "scheduled"
                            ? "bg-green-100 text-green-600"
                            : appt.status.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : appt.status.toLowerCase() === "completed"
                            ? "bg-gray-200 text-gray-500"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    {/* Appointment Details */}
                    <div className="mt-3 space-y-2 text-gray-700 text-sm">
                      <p>
                        <span className="font-medium text-gray-600">
                          Appointment Date:{" "}
                        </span>
                        {formatDate(appt.appointmentDate)}
                      </p>
                      <p
                        className={`px-3 py-1 ${
                          appt.mode === "online"
                            ? "bg-green-100 text-green-500"
                            : "bg-blue-100 text-blue-500"
                        }  rounded-full w-fit`}
                      >
                        {appt.mode}
                      </p>
                    </div>

                    {appt.mode === "online" ? (
                      <button
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
                        onClick={() =>
                          navigate(`/video-call-lobby/${appt.roomId}`)
                        }
                      >
                        Join Call
                      </button>
                    ) : (
                      ""
                    )}
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
