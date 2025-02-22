import React, { useState, useEffect, useCallback } from "react";
import Calendar from "../CommanComponents/Calendar";
import { FaHeartPulse, FaTemperatureHigh, FaDroplet } from "react-icons/fa6";
import { SiOxygen } from "react-icons/si";
import axios from "axios";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import { AiOutlineFileSearch } from "react-icons/ai";
import { Legend } from "recharts";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const PatientDashboard = ({ user, setActiveSection }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
const healthData = [
  { day: "Mon", heartRate: 72, spo2: 98 },
  { day: "Tue", heartRate: 75, spo2: 97 },
  { day: "Wed", heartRate: 78, spo2: 96 },
  { day: "Thu", heartRate: 74, spo2: 98 },
  { day: "Fri", heartRate: 76, spo2: 97 },
];

  const analyticsCards = [
    {
      title: "Heart Rate",
      value: "83",
      description: "Your Heart Rate",
      icon: <FaHeartPulse />,
      bgColor: "bg-red-100",
      iconColor: "text-red-500",
      borderColor: "border-red-500",
    },
    {
      title: "SPo2",
      value: "95%",
      description: "Your Oxygen level",
      icon: <SiOxygen />,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500",
    },
    {
      title: "Temperature",
      value: "37°C",
      description: "Your body temperature",
      icon: <FaTemperatureHigh />,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-500",
      borderColor: "border-orange-500",
    },
    {
      title: "Blood Pressure",
      value: "90mmhg",
      description: "Your Blood Pressure",
      icon: <FaDroplet />,
      bgColor: "bg-green-100",
      iconColor: "text-green-500",
      borderColor: "border-green-500",
    },
  ];
const apiUrl = process.env.REACT_APP_API_BASE_URL;
  // Fetch Appointments
  const fetchAppointments = useCallback(async () => {
  
    try {
      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.get(
        `${apiUrl}/api/v1/find-patient-appointments/${user._id}`,
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
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Format Date
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full min-h-[85vh] bg-gray-50 p-4">
      <div className="w-full h-full bg-white rounded-xl overflow-y-auto p-4 shadow-md">
        {/* Welcome Section */}
        <div className="w-full flex gap-2">
          <div className="w-full">
            <div className="m-4 p-4 rounded-xl text-white bg-[#116AEF] h-fit">
              <p>Good Morning</p>
              <h1 className="capitalize text-3xl font-semibold">
                Welcome <span className="text-3xl inline-block">👋</span>,{" "}
                {user?.name}!
              </h1>
              <p className="text-sm text-white">Check your Health status.</p>
              <div className="grid grid-cols-2 p-2 mt-2 bg-white rounded-xl lg:grid-cols-4 gap-4">
                {analyticsCards.map((card, index) => (
                  <div
                    key={index}
                    className={`p-2 md:p-4 ${card.bgColor} border-l-4 ${card.borderColor} rounded-lg shadow-sm`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs md:text-sm font-medium text-gray-700">
                        {card.title}
                      </h3>
                      <span className={`text-lg md:text-3xl ${card.iconColor}`}>
                        {card.icon}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xl text-black md:text-3xl font-bold">
                        {card.value}
                      </p>
                      <p className="text-xs mt-1 md:text-md text-gray-500">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full h-fit px-4 py-2 bg-gray-100 rounded-xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveSection("book-appointments")}
                  className="w-full p-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => setActiveSection("prescriptions")}
                  className="w-full p-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600"
                >
                  View Prescriptions
                </button>
                <button className="w-full p-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600">
                  Lab Reports
                </button>
                <button
                  onClick={() => setActiveSection("check-bed-availability")}
                  className="w-full p-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                >
                  Check Bed Availability
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="w-1/2 py-4">
            <div className="bg-white border border-gray-300 rounded-xl  p-2 ">
              <h1 className="font-semibold text-xl text-gray-500 mt-2 mb-2">
                Upcoming Appointments
              </h1>
              <div className="w-full h-[35vh] overflow-y-scroll">
                {appointments.length > 0 ? (
                  appointments
                    .filter((appt) => appt.status.toLowerCase() === "pending")
                    .sort(
                      (a, b) =>
                        new Date(b.appointmentDate) -
                        new Date(a.appointmentDate)
                    )

                    .map((appt, index) => (
                      <div
                        key={index}
                        className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between space-x-3">
                          <div className="flex gap-3">
                            <Avatar
                              name={appt?.doctor?.name}
                              src={`${apiUrl}/uploads/${appt?.doctor?.profileImg}`}
                              size="50"
                              className="rounded-xl"
                            />
                            <div>
                              <h3 className="text-lg font-semibold">
                                {appt?.doctor?.name || "Unknown Doctor"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {appt?.doctor?.specialization || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            <span
                              className={`text-xs rounded-full px-2 py-1 ${
                                appt.mode === "online"
                                  ? "bg-green-200 text-green-500"
                                  : "bg-blue-200 text-blue-500"
                              }`}
                            >
                              {appt.mode}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mt-2">
                          Appointment Date: {formatDate(appt.appointmentDate)}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="w-full h-[40vh] flex items-center justify-center text-gray-500">
                    <AiOutlineFileSearch size={70} />
                    <p>No Appointments Found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-4">
          <div className="bg-white border border-gray-300 rounded-2xl p-4 w-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Health Data Overview
            </h3>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="flex items-center text-red-500 font-medium">
                🔴 Heart Rate
              </span>
              <span className="flex items-center text-blue-500 font-medium">
                🔵 SpO2
              </span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={healthData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />
                <XAxis dataKey="day" className="text-gray-500" />
                <YAxis className="text-gray-500" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  stroke="red"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="spo2"
                  stroke="blue"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/3">
            <Calendar />
          </div>
        </div>

        {/* Calendar */}
      </div>
    </div>
  );
};

export default PatientDashboard;
