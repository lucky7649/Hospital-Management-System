import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../BackBtn/BackButton";
import {
  RiUserHeartLine,
  RiStethoscopeLine,
  RiHospitalLine,
  RiCalendarCheckLine,
  RiPhoneLine,
} from "react-icons/ri";
import Avatar from "react-avatar";

const BedDetails = () => {
  const { roomId, bedId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchBedDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/v1/view-bed-details/${roomId}/${bedId}`
        );

        setData(response.data);
        if (response.data.isOccupied && response.data.occupant) {
          const patientResponse = await axios.get(
            `http://localhost:1000/api/v1/patient/${response.data.occupant}`
          );
          setPatientData(patientResponse.data.patient);
        }
      } catch (err) {
        setError("Error fetching bed details");
      } finally {
        setLoading(false);
      }
    };

    fetchBedDetails();
  }, [roomId, bedId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center text-red-500">
        <p className="text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-auto min-h-screen bg-gray-50 py-10">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
        <BackButton />

        <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-2 border-b pb-3 mb-5">
          <RiHospitalLine /> Bed Details
        </h2>

        {data ? (
          <>
            <div className="mb-5">
              <p className="text-lg flex items-center gap-2">
                <RiStethoscopeLine className="text-blue-600" />
                <span className="font-semibold">Bed Number:</span>{" "}
                {data.bedNumber}
              </p>
              <p className="text-lg flex items-center gap-2">
                <RiCalendarCheckLine className="text-blue-600" />
                <span className="font-semibold">Status:</span>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    data.isOccupied
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {data.isOccupied ? "Occupied" : "Available"}
                </span>
              </p>
            </div>

            {data.isOccupied && patientData ? (
              <div className="bg-gray-100 p-5 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-700 flex items-center gap-2 border-b pb-3 mb-4">
                  <RiUserHeartLine /> Patient Details
                </h3>

                {/* Patient Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar
                    name={patientData?.name}
                    src={`http://localhost:1000/uploads/${patientData?.profileImg}`}
                    className="rounded-xl"
                    size="50"
                  />
                  <div>
                    <p className="text-lg font-semibold">{patientData.name}</p>
                    <p className="text-sm text-gray-500">
                      {patientData.age} years old
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-lg">
                    <span className="font-semibold">Gender:</span>{" "}
                    {patientData.gender || "N/A"}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Condition:</span>{" "}
                    {patientData.condition || "N/A"}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Admission Date:</span>{" "}
                    {patientData.admissionDate
                      ? new Date(patientData.admissionDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Contact & Emergency Section */}
                <div className="mt-4 border-t pt-3">
                  <p className="text-lg flex items-center gap-2">
                    <RiPhoneLine className="text-blue-600" />
                    <span className="font-semibold">Contact:</span>{" "}
                    {patientData.contact || "N/A"}
                  </p>
                  <p className="text-lg flex items-center gap-2">
                    <RiPhoneLine className="text-blue-600" />
                    <span className="font-semibold">
                      Emergency Contact:
                    </span>{" "}
                    {patientData.emergencyContact || "N/A"}
                  </p>
                </div>

                {/* Medical History */}
                <div className="mt-4 border-t pt-3">
                  <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                    <RiStethoscopeLine /> Medical History
                  </h3>
                  {patientData.medicalHistory &&
                  patientData.medicalHistory.length > 0 ? (
                    <ul className="list-disc pl-5 mt-2 text-gray-700">
                      {patientData.medicalHistory.map((history, index) => (
                        <li key={index}>{history}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg text-gray-500">
                      No medical history available.
                    </p>
                  )}
                </div>

                {/* Next Checkup Date */}
                <div className="mt-4 border-t pt-3">
                  <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                    <RiCalendarCheckLine /> Next Checkup
                  </h3>
                  <p className="text-lg">
                    {patientData.nextCheckup
                      ? new Date(patientData.nextCheckup).toLocaleDateString()
                      : "Not Scheduled"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-lg text-gray-500">
                No patient data available.
              </p>
            )}
          </>
        ) : (
          <p className="text-lg text-gray-500">
            No data available for this bed.
          </p>
        )}
      </div>
    </div>
  );
};

export default BedDetails;
