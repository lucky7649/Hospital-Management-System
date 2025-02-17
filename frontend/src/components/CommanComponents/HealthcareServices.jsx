// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaRegCalendarAlt, FaUserMd } from "react-icons/fa";
// import { MdBedroomParent } from "react-icons/md";
// import { FaMagnifyingGlass } from "react-icons/fa6";
// import { PiNotePencilBold } from "react-icons/pi";
// import { FaLaptop } from "react-icons/fa";
// import { GiPill } from "react-icons/gi";
// import { useNavigate } from "react-router-dom";
// import { useActiveSection } from "../../context/ActiveSectionContext";
// import { RiFileList3Line } from "react-icons/ri";
// const HealthcareActions = () => {
//   const navigate = useNavigate();
//       const { setActiveSection } = useActiveSection();
//    const patientActions = [
//      {
//        icon: <PiNotePencilBold />,
//        label: "My Appointments",
//        url: "/patient-dashboard",
//        activeSection: "appointments",
//        iconColor: "text-green-600",
//        borderColor: "border-green-600",
//      },
//      {
//        icon: <FaRegCalendarAlt />,
//        label: "Book Appointment",
//        url: "/patient-dashboard",
//        activeSection: "book-appointments",
//        iconColor: "text-blue-500",
//        borderColor: "border-blue-500",
//      },
//      {
//        icon: <FaMagnifyingGlass />,
//        label: "Find Doctor",
//        url: "/all-doctors",
//        iconColor: "text-green-500",
//        borderColor: "border-green-500",
//      },
//      {
//        icon: <MdBedroomParent />,
//        label: "Check Bed Availability",
//        url: "/check-bed-availability",
//        iconColor: "text-purple-500",
//        borderColor: "border-purple-500",
//      },
//      {
//        icon: <FaLaptop />,
//        label: "Consult Online",
//        url: "/consult-online",
//        iconColor: "text-yellow-500",
//        borderColor: "border-yellow-500",
//      },
//      {
//        icon: <GiPill />,
//        label: "Buy Medicine",
//        url: "/buy-medicine",
//        iconColor: "text-orange-500",
//        borderColor: "border-orange-500",
//      },
//    ];
//   const [role, setRole] = useState(null);
//   setRole(localStorage.getItem(role));
//    // Actions for Doctors
//    const doctorActions = [
//      {
//        icon: <FaUserMd />,
//        label: "My Patients",
//        url: "/doctor-dashboard",
//        activeSection: "patients",
//        iconColor: "text-blue-600",
//        borderColor: "border-blue-600",
//      },
//      {
//        icon: <RiFileList3Line />,
//        label: "Appointments",
//        url: "/doctor-dashboard",
//        activeSection: "appointments",
//        iconColor: "text-green-500",
//        borderColor: "border-green-500",
//      },
//      {
//        icon: <FaLaptop />,
//        label: "Online Consultations",
//        url: "/doctor-consultations",
//        iconColor: "text-yellow-500",
//        borderColor: "border-yellow-500",
//      },
//    ];

//    // Determine which actions to display based on the user role
//    const actions = role === "doctor" ? doctorActions : patientActions;

//   return (
//     <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 lg:grid-cols-6 p-4 md:p-6 bg-[#dcecf8] shadow-md rounded-lg">
//       {actions.map((action, index) => (
//         <button
//           key={index}
//           onClick={() => {
//             setActiveSection(action?.activeSection); // Set active section
//             navigate(action.url); // Navigate to the route
//           }}
//           className={` ${action.iconColor}  flex flex-col items-center  justify-center w-full  px-2 h-24 sm:h-28 md:h-32 bg-white shadow-md rounded-lg text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg border-l-4 ${action.borderColor}`}
//         >
//           <div className="text-2xl sm:text-4xl mb-2">{action.icon}</div>
//           <div className="text-xs md:text-sm font-medium text-gray-700">
//             {action.label}
//           </div>
//         </button>
//       ))}
//     </div>
//   );
// };

// export default HealthcareActions;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveSection } from "../../context/ActiveSectionContext";

import { FaRegCalendarAlt, FaUserMd } from "react-icons/fa";
import { MdBedroomParent } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { PiNotePencilBold } from "react-icons/pi";
import { FaLaptop } from "react-icons/fa";
import { GiPill } from "react-icons/gi";
import { RiFileList3Line } from "react-icons/ri";

const HealthcareActions = () => {
  const navigate = useNavigate();
  const { setActiveSection } = useActiveSection();

  // Fetch role from localStorage once when the component mounts
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // Correctly get the stored role
    setRole(storedRole);
  }, []);

  // Actions for Patients
  const patientActions = [
    {
      icon: <PiNotePencilBold />,
      label: "My Appointments",
      url: "/patient-dashboard",
      activeSection: "appointments",
      iconColor: "text-green-600",
      borderColor: "border-green-600",
    },
    {
      icon: <FaRegCalendarAlt />,
      label: "Book Appointment",
      url: "/patient-dashboard",
      activeSection: "book-appointments",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500",
    },
    {
      icon: <FaMagnifyingGlass />,
      label: "Find Doctor",
      url: "/all-doctors",
      iconColor: "text-green-500",
      borderColor: "border-green-500",
    },
    {
      icon: <MdBedroomParent />,
      label: "Check Bed Availability",
      url: "/check-bed-availability",
      iconColor: "text-purple-500",
      borderColor: "border-purple-500",
    },
    {
      icon: <FaLaptop />,
      label: "Consult Online",
      url: "/consult-online",
      iconColor: "text-yellow-500",
      borderColor: "border-yellow-500",
    },
    {
      icon: <GiPill />,
      label: "Buy Medicine",
      url: "/buy-medicine",
      iconColor: "text-orange-500",
      borderColor: "border-orange-500",
    },
  ];

  // Actions for Doctors
  const doctorActions = [
    {
      icon: <FaUserMd />,
      label: "My Patients",
      url: "/doctor-dashboard",
      activeSection: "patients",
      iconColor: "text-blue-600",
      borderColor: "border-blue-600",
    },
    {
      icon: <RiFileList3Line />,
      label: "Appointments",
      url: "/doctor-dashboard",
      activeSection: "appointments",
      iconColor: "text-green-500",
      borderColor: "border-green-500",
    },
    {
      icon: <FaLaptop />,
      label: "Online Consultations",
      url: "/doctor-consultations",
      iconColor: "text-yellow-500",
      borderColor: "border-yellow-500",
    },
  ];

  // Determine which actions to display based on the user role
  const actions = role === "doctor" ? doctorActions : patientActions;

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 lg:grid-cols-6 p-4 md:p-6 bg-[#dcecf8] shadow-md rounded-lg">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => {
            setActiveSection(action?.activeSection);
            navigate(action.url);
          }}
          className={` ${action.iconColor} flex flex-col items-center justify-center w-full px-2 h-24 sm:h-28 md:h-32 bg-white shadow-md rounded-lg text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg border-l-4 ${action.borderColor}`}
        >
          <div className="text-2xl sm:text-4xl mb-2">{action.icon}</div>
          <div className="text-xs md:text-sm font-medium text-gray-700">
            {action.label}
          </div>
        </button>
      ))}
    </div>
  );
};

export default HealthcareActions;
