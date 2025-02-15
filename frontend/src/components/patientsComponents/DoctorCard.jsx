import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import Avatar from "react-avatar";



const DoctorCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="group block bg-white shadow-md rounded-2xl h-fit p-6 hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-2">
      <Link
        to={`/view-doctor-details/${data._id}`}
        className="flex items-start gap-6"
      >
        <Avatar
          name={data?.name}
          src={`http://localhost:1000/uploads/${data?.profileImg}`}
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
            <span className="text-gray-600 font-semibold">Languages:</span>{" "}
            {data.languages?.join(", ") || "Not specified"}
          </p>
          <div className="mt-4 text-sm text-gray-600 space-y-1">
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
              <strong className="text-green-500">Availability:</strong>{" "}
              {data.availability?.days?.join(", ") || "Days not specified"} -{" "}
              {data.availability?.timeSlots
                ?.map((slot) => `${slot.start} - ${slot.end}`)
                .join(", ") || "Time slots not available"}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex mt-5 gap-4">
        <button
          onClick={() => navigate("/book-appointment", { state: { data } })}
          className="flex-1 bg-blue-500 text-white text-sm md:text-base px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200"
        >
          Book an Appointment
        </button>
        <button className="flex-1 flex gap-2 items-center text-sm md:text-base justify-center bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-400 transition-all duration-200">
          <FaPhoneAlt className="text-lg" /> Call
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
