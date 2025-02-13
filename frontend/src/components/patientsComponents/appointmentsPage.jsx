
import { useState, useEffect } from "react";
import { FiClock, FiMapPin, FiMoreVertical } from "react-icons/fi";
import axios from "axios";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const headers = {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const response = await axios.get(
          "http://localhost:1000/api/v1/get-user-information",
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
        `http://localhost:1000/api/v1/find-patient-appointments/${userId}`,
        { headers }
      );

      const appointmentsData = response.data.data;

      const appointmentsWithDoctors = await Promise.all(
        appointmentsData.map(async (appointment) => {
          if (!appointment.doctorId) return appointment;

          try {
            const doctorResponse = await axios.get(
              `http://localhost:1000/api/v1/get-staff/${appointment.doctorId}`,
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
  return (
    <div className="p-6 flex flex-col md:flex-row gap-4 w-full mx-auto">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 h-screen bg-gray-500 rounded-xl"></div>

      {/* Main Content */}
      <div className="w-full">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <p className="text-gray-500">
          See your scheduled appointments from your calendar.
        </p>

        {/* Tabs */}
        <div className="flex space-x-2 mt-4">
          {["Upcoming", "Pending", "Past", "Cancelled"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded ${
                tab === "Upcoming" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-6">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-600 text-sm">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Specialty</th>
                <th className="py-3 px-4">Date and Time</th>
                <th className="py-3 px-4">Facility</th>
                <th className="py-3 px-4">Doctor's Name</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appt, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appt.status.toLowerCase() === "scheduled"
                            ? "bg-green-100 text-green-600"
                            : appt.status.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : appt.status.toLowerCase() === "completed"
                            ? "bg-blue-100 text-blue-400"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {capitalize(appt.status)}
                      </span>
                    </td>

                    {/* Specialty */}
                    <td className="py-4 px-4 text-gray-700">
                      {appt?.doctor?.specialization || "N/A"}
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-4 text-gray-700">
                      <p className="font-medium">
                        {formatDate(appt.appointmentDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTime(appt.createdAt)}
                      </p>
                    </td>

                    {/* Facility */}
                    <td className="py-4 px-4 text-gray-700">
                      <div
                        className={`font-semibold w-fit px-3 py-1 rounded-xl text-sm ${
                          appt.mode.toLowerCase() === "online"
                            ? "bg-green-200  text-green-700"
                            : "bg-blue-100  text-blue-700"
                        }`}
                      >
                        {appt.mode}
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="py-4 px-4 flex items-center space-x-3">
                      <img
                        src={
                          appt?.doctor?.image ||
                          "https://via.placeholder.com/40"
                        }
                        alt={appt?.doctor?.name || "Doctor"}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">
                          {appt?.doctor?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appt?.doctor?.specialization || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="relative">
                      <button
                        className="p-2"
                        onClick={() =>
                          setOpenDropdown(openDropdown === index ? null : index)
                        }
                      >
                        <FiMoreVertical />
                      </button>

                      {/* Dropdown Menu */}
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
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    No Appointments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
