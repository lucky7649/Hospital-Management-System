import React, { useState, useEffect } from "react";
import BedChecking from "../components/CommanComponents/BedChecking";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoBedSharp } from "react-icons/io5";
import DoctorAppointment from "../components/DoctorDashboardLinks/DoctorAppointment";
import { FaUser } from "react-icons/fa6";
import DoctorOverview from "../components/DoctorDashboardLinks/DocOverview";
import axios from "axios";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import Avatar from "react-avatar";

const DoctorDashboard = () => {
  const savedActiveSection = localStorage.getItem("activeSection");
  const [activeSection, setActiveSection] = useState(
    savedActiveSection || "dashboard"
  );
  const [doctor, setDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
      window.innerWidth < 768
    );

  const id = localStorage.getItem("userId");
const apiUrl = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    if (!id) {
      setError("No ID found in localStorage.");
      setLoading(false);
      return;
    }
    

    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/get-staff/${id}`);
        setDoctor(response.data.data);
      } catch (err) {
        setError("Failed to fetch doctor data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);
  const renderContent = () => {
    switch (activeSection) {
      case "doctorOverview":
        return <DoctorOverview doctor={doctor} />;

      case "check-bed-availability":
        return <BedChecking />;
      case "appointments":
        return <DoctorAppointment />;
      default:
        return <DoctorOverview />;
    }
  };
  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

    const navigationItems = [
      {
        label: "Dashboard",
        icon: <TbLayoutDashboardFilled />,
        key: "doctorOverview",
      },
      { label: "Appointments", icon: <FaUser />, key: "appointments" },
       {
        label: "Check Beds Availability",
        icon: <IoBedSharp />,
        key: "check-bed-availability",
      },
    ];

  return (
    <div className="flex flex-col lg:flex-row  w-full h-[90vh] fixed border-t-2 border-gray-300">
      {/* Collapsible Sidebar */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-16" : "w-64"
        } bg-white shadow-md h-full transition-all duration-300 fixed lg:relative z-10`}
      >
        <div className="flex items-center justify-between p-4">
          <div
            className={`text-blue-500 font-semibold text-xl  flex text-center transition-opacity duration-300 ease-in-out `}
          >
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 rounded overflow-hidden">
                <Avatar
                  name={doctor?.name}
                  src={`${apiUrl}/uploads/${doctor?.profileImg}`}
                  size="40"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`flex flex-col ${
                  isSidebarCollapsed ? " hidden" : "block"
                }`}
              >
                <p className="text-sm capitalize font-semibold ">
                  {doctor?.name}
                </p>
                <p className="text-xs capitalize text-gray-500 font-semibold">
                  {doctor?.email}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 text-white text-xl bg-blue-500 rounded-full absolute top-16 right-[-12px]  focus:outline-none"
          >
            {isSidebarCollapsed ? (
              <IoMdArrowDropright />
            ) : (
              <IoMdArrowDropleft />
            )}
          </button>
        </div>
        <nav>
          <ul
            className={`space-y-4 border-t-2 border-b-2 border-gray-100 ${
              isSidebarCollapsed ? "p-3" : "p-4"
            }`}
          >
            {navigationItems.map(({ label, icon, key }) => (
              <li
                key={key}
                role="button"
                aria-current={activeSection === key ? "page" : undefined}
                onClick={() => setActiveSection(key)}
                className={`flex items-center gap-2 text-gray-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-600 rounded cursor-pointer ${
                  activeSection === key ? "bg-blue-500 text-white" : ""
                } ${isSidebarCollapsed ? "p-3" : "p-2"}`}
              >
                {icon && <span className="text-lg">{icon}</span>}
                {!isSidebarCollapsed && label}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-14 md:ml-0 overflow-y-auto bg-gray-50 shadow-inner">
        <div className="transition-opacity duration-300 ease-in-out">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
