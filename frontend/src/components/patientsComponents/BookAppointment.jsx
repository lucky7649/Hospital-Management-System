import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";
import Calendar from "../CommanComponents/Calendar";




const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientCondition, setPatientCondition] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  
  const [gender, setGender] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [mode, setMode] = useState("in-person");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const headers = {
    id: localStorage.getItem("userId"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const navigate = useNavigate();
  // Fetch doctors and patient data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-doctor-data"
        );
        setDoctors(response.data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const fetchPatient = async () => {
      const patientIdFromStorage = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `http://localhost:1000/api/v1/patient/${patientIdFromStorage}`
        );
        const patient = response.data.patient || {};
        setPatientName(patient.name || "");
        setPatientAge(patient.age || "");
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchDoctors();
    fetchPatient();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentData = {
      doctorId: selectedDoctorId,
      patientName,
      patientAge,
      patientCondition,
      gender,
      contactNumber,
      email,
      dateOfBirth,
      reasonForVisit,
      
      mode,
      appointmentDate,
    };

    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/book-appointment",
        appointmentData,
        { headers }
      );

      toast.success("Appointment booked successfully!");
      navigate("/patient-dashboard", {
        state: { activeSection: "appointments" },
      });

      openModal(true);
      handleReset();
      console.log("Appointment response:", response.data);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed! Try again.");
    }
  };
  //handel reset form
  const handleReset = () => {
    setPatientName("");
    setPatientAge("");
    setPatientCondition("");
    setSelectedDoctorId("");
    setGender("");
    setContactNumber("");
    setEmail("");
    setDateOfBirth("");
    setReasonForVisit("");
    
    setMode("in-person");
    setAppointmentDate("");
  };
  return (
    <div className="w-full flex gap-2 p-6 h-fit">
      <div className="w-1/3 bg-gray-100 rounded-xl p-4">
        <h1 className="text-3xl font-bold text-gray-600 mb-4">
          Book Your <span className="text-blue-500">Appointment </span>– Fast,
          Easy & Secure
        </h1>
        <p className="text-lg text-gray-500 mb-4">
          Easily schedule an appointment with our expert doctors. Select your
          preferred date, time, and specialist, and get instant confirmation.
        </p>
        <Calendar/>
      </div>
      <div className="w-full">
        <div className="w-full h-full mx-auto p-4 bg-gray-50 shadow-md rounded-lg">
          <h2 className="text-2xl text-gray-600 font-bold mb-4">
            Book an <span className="text-blue-500">Appointment </span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-xl text-gray-500 font-semibold">
              Personal Information
            </h1>
            <div className="flex w-full gap-4 items-center ">
              {/* Patient Name Field */}

              <input
                type="text"
                id="patientName"
                value={patientName}
                placeholder="Enter your name..."
                onChange={(e) => setPatientName(e.target.value)}
                className="p-2 border w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />

              {/* Patient Age Field */}

              <input
                type="number"
                id="patientAge"
                value={patientAge}
                placeholder="Enter your age..."
                onChange={(e) => setPatientAge(e.target.value)}
                className="p-2 border w-3/6 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="flex w-full gap-4 items-center ">
              {/* Gender Field */}

              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="p-2 border w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              {/* Date of Birth Field */}

              <input
                type="date"
                id="dateOfBirth"
                value={dateOfBirth}
                placeholder="Select your DOB..."
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="p-2 border w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <h1 className="text-xl text-gray-500 font-semibold">
              Contact Inforamtaions
            </h1>
            <div className="flex flex-col gap-4">
              {/* Contact Number Field */}
              <div className="flex flex-col">
                <input
                  type="text"
                  id="contactNumber"
                  value={contactNumber}
                  placeholder="Phone No"
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col">
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Reason for Visit Field */}
            <h1 className="text-xl text-gray-500 font-semibold">
              Reason for Visit
            </h1>
            <div className="flex flex-col">
              <textarea
                type="text"
                id="reasonForVisit"
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Mode of Appointment */}
            <h1 className="text-xl text-gray-500 font-semibold">
              Mode of Appointment
            </h1>
            <div className="flex flex-col bg-gray-100 rounded-xl p-4">
              <div className="flex space-x-4">
                <div>
                  <input
                    type="radio"
                    id="inPerson"
                    name="mode"
                    value="in-person"
                    checked={mode === "in-person"}
                    onChange={(e) => setMode(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="inPerson">In-person</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="online"
                    name="mode"
                    value="online"
                    checked={mode === "online"}
                    onChange={(e) => setMode(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="online">Online</label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full items-center">
              {/*Appointment Date Field */}
              <div className="flex w-full flex-col">
                <label htmlFor="appointmentDate" className="text-gray-700 mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  id="appointmentDate"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="p-2 border w-full border-gray-300 rounded-md outline-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Doctor Selection Field */}
              <div className="flex w-full flex-col">
                <label htmlFor="doctor" className="text-gray-700 mb-1">
                  Doctor:
                </label>
                <select
                  id="doctor"
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="p-2 border w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name || "Unknown Doctor"} -{" "}
                      {doctor.specialization || "Specialization not provided"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleReset}
                className="w-full py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-200"
              >
                Reset Form
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
              >
                Book Appointment
              </button>
            </div>
          </form>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl flex flex-col items-center justify-center font-bold text-center text-green-500">
                  <img
                    src="/assets/check.png"
                    alt="check"
                    className="w-24 mb-3"
                  />
                  Booking Successful!
                </h2>
                <p className="mt-4 text-center text-gray-700">
                  Your appointment has been successfully booked.
                </p>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
