import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import HospitalInfo from "../CommanComponents/LocationTab";
import Avatar from "react-avatar";



const DoctorProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/v1/get-staff/${id}`
        );
        setData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch doctor data.");
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl  h-full  mx-auto px-2 py-4 md:p-6  mb-20 bg-gray-50 md:rounded-lg md:shadow-md">
      <div className="flex gap-4 flex-col  justify-between  md:flex-row items-start lg:items-start bg-white rounded-lg p-6 shadow-lg">
        <div className="flex gap-3 items-start w-full">
          <Avatar
            name={data?.name}
            src={`http://localhost:1000/uploads/${data?.profileImg}`}
            className="rounded-xl shadow-sm"
            size="300"
          />
          <div className="flex-1 p-4 w-full">
            <h2 className="text-3xl font-bold capitalize text-gray-800">
              Dr. {data?.name?.replace(/^Dr\.?\s*/i, "")}
            </h2>
            <p className="mt-1 text-lg font-semibold text-blue-600">
              {data.specialization || "Specialization not specified"}
            </p>
            <hr className="mb-4" />
            <p className="text-lg text-blue-600 mb-4">
              🎓 {data.qualification || "N/A"}
            </p>
            <p className="text-lg text-blue-600 mb-4">
              {data.experience || "N/A"}+ years experience
            </p>
            <p className="text-lg text-blue-600 mb-4">
              <span className="text-gray-600 font-semibold">
                Registration No:
              </span>{" "}
              {data.registrationNo || "N/A"}
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
                data.address?.city,
                data.address?.state,
                data.address?.postalCode,
                data.address?.country,
              ]
                .filter(Boolean)
                .join(", ") || "Address not available"}{" "}
            </p>
          </div>
        </div>
        <div className="flex flex-row md:flex-col gap-3 w-1/4 justify-center">
          <Link
            to="/book-appointment"
            className="  lg:mt-0 lg:ml-auto text-sm sm:text-base font-semibold flex items-center bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 md:px-6 md:py-2 rounded shadow "
          >
            Book Appointment
          </Link>
       
        </div>
      </div>

      <HospitalInfo data={data} />
    </div>
  );
};

export default DoctorProfile;
