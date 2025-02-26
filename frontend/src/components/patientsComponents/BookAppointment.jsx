import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useActiveSection } from "../../context/ActiveSectionContext";
import DoctorCard from "./DoctorCard";
import { FaPhoneAlt } from "react-icons/fa";
import Avatar from "react-avatar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, startOfWeek } from "date-fns";





const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [mode, setMode] = useState("in-person");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [isToggled, setIsToggled] = useState("online");
  const [timeSlots, setTimeSlots] = useState([]);
  
 const { setActiveSection } = useActiveSection();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;


  const headers = {
    id: localStorage.getItem("userId"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
    const [data, setData] = useState([]);

  const navigate = useNavigate();
  // Fetch doctors and patient data
    useEffect(() => {
      const fetchDoctors = async () => {
     
        try {
          const response = await axios.get(`${apiUrl}/api/v1/get-doctor-data`, {
            headers,
          });
          setData(response.data.doctors);
        } catch (err) {
          console.error("Error fetching doctors", err);
        }
      };

      fetchDoctors();
    }, []);
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/get-doctor-data`
        );
        setDoctors(response.data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

  

    fetchDoctors();
   
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const appointmentData = {
    doctorId: selectedDoctor._id,
    reasonForVisit,
    timeSlot: selectedTime,
    mode: isToggled,
    appointmentDate: selectedDate.toISOString().split("T")[0],
  };
console.log(appointmentData);
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/book-appointment`,
      appointmentData,
      { headers }
    );
    

    toast.success("Appointment booked successfully!");

    openModal(true);
    handleReset();
    

  
    setTimeout(() => {setActiveSection("appointments");
      navigate("/patient-dashboard");
    }, 2000); 
  } catch (error) {
    console.error("Error booking appointment:", error);
    toast.error("Failed! Try again.");
  }
  };


const handleToggle = () => {
  setIsToggled((prevState) =>
    prevState === "online" ? "in-person" : "online"
  );
};


const daysOfWeek = Array.from({ length: 15 }, (_, index) =>
  addDays(new Date(), index)
);


useEffect(() => {
   if (selectedDoctor && selectedDate) {
     const dayOfWeek = format(selectedDate, "EEEE"); 


     const dayAvailability = selectedDoctor?.timeSlots?.find(
       (day) => day.day === dayOfWeek
     );

     if (dayAvailability) {
       // Filter slots based on toggle state
       const slots = isToggled
         ? dayAvailability.inPersonSlots
         : dayAvailability.onlineSlots;

       const filteredSlots = slots.map((slot) => ({
         time: slot.time,
         isBooked: slot.isBooked,
         id: slot._id,
       }));

       setTimeSlots(filteredSlots);
     } else {
       setTimeSlots([]);
     }
   }
 }, [selectedDate, isToggled, selectedDoctor]);


  const handleReset = () => {
    setSelectedDoctorId("");
    setReasonForVisit("");
    setMode("in-person");
    setAppointmentDate("");
  };
  return (
    <div className="w-full flex flex-col md:flex-row bg-gray-100 gap-2 p-4 md:p-6 h-fit">
      {!selectedDoctor ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data &&
            data.map((data, i) => (
              <div className="group block bg-white shadow-md rounded-2xl h-fit p-3 md:p-6 hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-2">
                <div
                  onClick={() => setSelectedDoctor(data)}
                  className="flex  items-start gap-6"
                >
                  <Avatar
                    name={data?.name}
                    src={data?.profileImg}
                    className="rounded-2xl shadow-md object-cover"
                    size="200"
                  />

                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                      Dr. {data?.name?.replace(/^Dr\.?\s*/i, "")}
                    </h3>
                    <p className="text-sm font-medium p-2 mb-2 bg-gray-200 w-fit rounded-xl text-gray-500  capitalize">
                      {data.specialization || "Specialization not available"}
                    </p>
                    <p className="text-sm text-blue-600">
                      <span className="text-gray-600 font-semibold">
                        Registration No:
                      </span>{" "}
                      {data.registrationNo || "N/A"}
                    </p>
                    <p className="text-sm text-blue-600">
                      <span className="text-gray-600 font-semibold">
                        Languages:
                      </span>{" "}
                      {data.languages?.join(", ") || "Not specified"}
                    </p>
                    <div className="mt-4 text-sm hidden md:block text-gray-600 space-y-1">
                      <p>
                        🏅{" "}
                        {data.experience
                          ? `${data.experience} years of experience`
                          : "Experience not available"}
                      </p>
                      <p>
                        📍 {data.address?.city || "City"},{" "}
                        {data.address?.country || "Country"}
                      </p>
                      <p className="mt-2">
                        <strong className="text-green-500">
                          Availability:
                        </strong>{" "}
                        {data.availability?.days?.join(", ") ||
                          "Days not specified"}{" "}
                        -{" "}
                        {data.availability?.timeSlots
                          ?.map((slot) => `${slot.start} - ${slot.end}`)
                          .join(", ") || "Time slots not available"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex mt-5 gap-4">
                  <button className="flex-1 bg-blue-500 text-white text-sm md:text-base md:px-4 px-2 py-1 md:py-2  rounded-lg font-medium hover:bg-blue-600 transition-all duration-200">
                    Book Appointment
                  </button>
                  <button className="flex-1 flex gap-2 items-center text-sm md:text-base justify-center bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-400 transition-all duration-200">
                    <FaPhoneAlt className="text-lg" /> Call
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="p-6 bg-white rounded-2xl w-full shadow-lg transition-transform transform">
          <div className="flex flex-col  md:flex-row gap-3 items-start w-full">
            <Avatar
              name={selectedDoctor}
              src={selectedDoctor?.profileImg}
              className="rounded-xl shadow-sm self-center"
              size="250"
            />
            <div className="flex-1 p-4 w-full">
              <h2 className="text-3xl font-bold capitalize text-gray-800">
                Dr. {selectedDoctor?.name?.replace(/^Dr\.?\s*/i, "")}
              </h2>
              <p className="mt-1 text-lg font-semibold text-blue-600">
                {selectedDoctor.specialization ||
                  "Specialization not specified"}
              </p>
              <hr className="mb-4" />
              <p className="text-lg text-blue-600 mb-4">
                🎓 {selectedDoctor.qualification || "N/A"}
              </p>
              <p className="text-lg text-blue-600 mb-4">
                {selectedDoctor.experience || "N/A"}+ years experience
              </p>
              <p className="text-lg text-blue-600 mb-4">
                <span className="text-gray-600 font-semibold">
                  Registration No:
                </span>{" "}
                {selectedDoctor.registrationNo || "N/A"}
              </p>
              <p className="text-lg text-gray-600">
                <span
                  role="img"
                  aria-label="Location"
                  className="mr-2 text-gray-600 font-semibold"
                >
                  Location:
                </span>
                {[
                  selectedDoctor.address?.city,
                  selectedDoctor.address?.state,
                  selectedDoctor.address?.postalCode,
                  selectedDoctor.address?.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "Address not available"}{" "}
              </p>
            </div>
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div
                className="relative flex items-center w-full p-1 border border-gray-300 rounded-xl bg-gray-50 cursor-pointer transition-all duration-300"
                onClick={handleToggle}
              >
                {/* Inactive Texts */}
                <span
                  className={`absolute w-1/2 flex items-center justify-center left-4 text-lg font-semibold transition-all duration-300 ${
                    isToggled === "online" ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  Online
                </span>
                <span
                  className={`absolute w-1/2 flex items-center justify-center right-4 text-lg font-semibold transition-all duration-300 ${
                    isToggled === "in-person"
                      ? "text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  In Person
                </span>

                {/* Toggle Element */}
                <div
                  className={`flex items-center justify-center w-1/2 h-10 rounded-xl transition-all duration-300 transform ${
                    isToggled === "in-person"
                      ? "translate-x-full bg-blue-100 text-blue-500 border border-blue-500"
                      : "bg-green-100 text-green-500 border border-green-500"
                  }`}
                >
                  <span className="font-semibold text-lg">
                    {isToggled === "in-person" ? "In Person" : "Online"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-xl border border-gray-300 p-4">
                <h1 className="text-xl font-semibold text-gray-500 ">
                  Choose date and time
                </h1>
                <span>
                  <hr />
                </span>
                <div className="flex justify-between gap-4 mb-4">
                  {daysOfWeek.map((day, index) => {
                    const isSelected =
                      format(day, "yyyy-MM-dd") ===
                      format(selectedDate, "yyyy-MM-dd");
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedDate(day)}
                        className={`flex flex-col items-center w-16 p-2 rounded-lg transition-all ${
                          isSelected
                            ? "bg-blue-100 border border-blue-600 text-blue-600 shadow-md"
                            : "bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-200"
                        }`}
                        aria-selected={isSelected}
                      >
                        <span
                          className={`text-xs ${
                            isSelected ? "text-blue-500" : "text-gray-600"
                          }`}
                        >
                          {format(day, "EEE")}
                        </span>
                        <span className="text-lg font-bold">
                          {format(day, "d")}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <span>
                  <hr />
                </span>
                <div className="grid grid-cols-6 gap-2 h-fit max-h-[30vh] overflow-y-scroll p-2 rounded-xl border border-gray-300">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2 rounded-full border transition-all ${
                          selectedTime === slot.time
                            ? "bg-blue-100 text-blue-600 border border-blue-600 shadow-md"
                            : slot.isBooked
                            ? "bg-red-100 text-red-500 border border-red-500 cursor-not-allowed"
                            : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                        disabled={slot.isBooked} // Disable button if the slot is booked
                      >
                        {slot.time} {/* Render the time property */}
                      </button>
                    ))
                  ) : (
                    <p className="col-span-3 w-full h-40 flex items-center justify-center text-gray-500 text-center">
                      No available slots for this day.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <textarea
                  type="text"
                  id="reasonForVisit"
                  value={reasonForVisit}
                  placeholder="Reason for visit"
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  className="p-2 text-sm md:text-base border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex gap-1  rounded-xl w-full justify-between bg-gray-50 border-2 border-[#D9EE53] text-gray-600 shadow-sm">
                <div className="flex gap-4 p-4  rounded-lg ">
                  <p className="font-semibold text-lg">
                    {selectedDate
                      ? format(selectedDate, "EEE | d, MMM yyyy")
                      : "No date selected"}
                  </p>
                  <span className="text-gray-300">|</span>
                  <p className="font-semibold text-lg text-gray-500">
                    {selectedTime ? selectedTime : "Select a time"}
                  </p>
                  <span className="text-gray-300">|</span>
                  <p className="font-semibold text-lg">
                    {isToggled === "online" ? "Online Mode" : "In Person Mode"}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-52 bg-[#D9EE53] text-xl text-gray-600 font-bold py-2 rounded-lg shadow hover:bg-[#c4df17] transition-all"
                >
                  Book
                </button>
              </div>
            </form>
          </div>
          <button
            onClick={() => setSelectedDoctor(null)}
            className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition-all"
          >
            Back to Doctors List
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-80 md:w-96 p-3 md:p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg md:text-xl flex flex-col items-center justify-center font-bold text-center text-green-500">
              <img src="/assets/check.png" alt="check" className="w-24 mb-3" />
              Booking Successful!
            </h2>
            <p className="mt-2 mb:mt-4 text-center text-gray-700">
              Your appointment has been successfully booked.
            </p>
            <div className="mt-3 md:mt-6 flex justify-center">
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
