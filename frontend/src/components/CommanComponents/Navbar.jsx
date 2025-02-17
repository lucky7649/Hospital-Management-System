import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGripLines, FaTimes } from "react-icons/fa";
import { TbHealthRecognition } from "react-icons/tb";
import { AiOutlineHome, AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { FaStethoscope, FaBed } from "react-icons/fa";
import { MdOutlineEventNote } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "./UserAvatar";
import { authActions } from "../../store/auth";
import { FiBell } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useActiveSection } from "../../context/ActiveSectionContext";

const Navbar = () => {
  const Links = {
    DefaultLinks: [
      { title: "Home", url: "/", icon: <AiOutlineHome /> },
      { title: "Find Doctors", url: "/all-doctors", icon: <FaStethoscope /> },
    ],
    patient: [
      { title: "Home", url: "/", icon: <AiOutlineHome /> },
      { title: "Find Doctors", url: "/all-doctors", icon: <FaStethoscope /> },
    

    
    
      {
        title: "Dashboard",
        url: "/patient-dashboard",
        icon: <FaBed />,
      },
    ],
    doctor: [
      { title: "Home", url: "/", icon: <AiOutlineHome /> },
      {
        title: "Check Bed Availability",
        url: "/check-bed-availability",
        icon: <FaBed />,
      },
      {
        title: "Dashboard",
        url: "/doctor-dashboard",
        icon: <FaBed />,
      },
    ],
    admin: [
      {
        title: "Dashboard",
        url: "/admin-dashboard",
        icon: <FaBed />,
      },
      {
        title: "Reports & Analytics",
        url: "/report",
        icon: <FaBed />,
      },
    ],
  };

    const { setActiveSection } = useActiveSection();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMobileNavVisible, setMobileNavVisible] = useState(false);
  const [userRole, setUserRole] = useState(null); // User role state

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); 

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  const roleLinks = userRole ? Links[userRole] : Links.DefaultLinks;

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <>
      <nav className="sticky top-0 bg-white shadow-md z-30 px-2 py-2 md:px-4 lg:px-32 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex gap-2 items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <span className="text-red-400 text-3xl font-bold">
              <TbHealthRecognition size={30} />
            </span>
          </div>
          <h1 className="text-2xl font-bold">MediCare</h1>
        </Link>
        <div className="nav-links-hospital block md:flex gap-6 items-center">
          <div className="hidden md:flex gap-2">
            {roleLinks.map((item, index) => (
              <NavLink
                to={item.url}
                key={index}
                className={({ isActive }) =>
                  `relative px-3 py-1 text-base font-medium transition-all duration-300 rounded-md 
              ${
                isActive
                  ? "text-blue-600 bg-blue-200 border-b-2 border-blue-500 "
                  : "text-gray-600 hover:text-blue-500 hover:bg-gray-100"
              }`
                }
              >
                {item.title}
                {/* Optional underline effect for active links */}
                {({ isActive }) =>
                  isActive && (
                    <span className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded-full transition-all duration-300"></span>
                  )
                }
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex gap-6">
            {userRole === "patient" && (
              <button
                onClick={() => {
                  setActiveSection("book-appointments"); // Set active section
                  navigate("/patient-dashboard"); // Navigate to the route
                }}
                className="px-3 py-2 border-blue-500 bg-gray-200 rounded hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Book appointment
              </button>
            )}
            {(userRole === "doctor" || userRole === "admin") && (
              <Link
                to="/notifications"
                className="p-3 text-gray-500 text-lg bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer transition-all duration-300"
              >
                <FiBell />
              </Link>
            )}

            {isLoggedIn === false && (
              <Link
                to="/login"
                onClick={() => setMobileNavVisible(false)}
                className="flex items-center justify-center px-4 py-2 text-lg font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg transition-all duration-300"
              >
                Login
                <AiOutlineLogin className="ml-2" />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn && <UserProfile />}
            <button
              className="block md:hidden text-gray-700 text-2xl hover:text-black"
              onClick={() => setMobileNavVisible(!isMobileNavVisible)}
            >
              {isMobileNavVisible ? <FaTimes /> : <FaGripLines />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {/* <div
        className={`${
          isMobileNavVisible ? "translate-y-20" : "-translate-y-full"
        } bg-gradient-to-b z-10 from-blue-100 via-white to-blue-50 h-fit px-10 py-20 top-0 left-0 w-full fixed flex md:hidden flex-col items-start justify-start transition-transform duration-500  shadow-lg`}
      >
        {roleLinks.map((item, index) => (
          <Link
            to={item.url}
            key={index}
            className="flex items-center gap-4 text-gray-700 text-lg md:text-xl mb-4 p-2 rounded-lg bg-blue-50 hover:bg-blue-500 hover:text-white shadow-md transition-all duration-300 w-full"
            onClick={() => setMobileNavVisible(false)}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
        <Link
          to="/book-appointment"
          onClick={() => setMobileNavVisible(false)}
          className="flex items-center justify-center px-4 py-2 mb-6 text-lg font-semibold text-blue-500 bg-white border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white shadow-lg transition-all duration-300"
        >
          Book appointment
        </Link>

        {isLoggedIn === false && (
          <Link
            to="/login"
            onClick={() => setMobileNavVisible(false)}
            className="flex items-center justify-center px-4 py-2 text-lg font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg transition-all duration-300"
          >
            Login
            <AiOutlineLogin className="ml-2" />
          </Link>
        )}
        {isLoggedIn && (
          <Link
            to="/"
            onClick={() => {
              handleLogout();
              setMobileNavVisible(false);
            }}
            className="flex items-center justify-center px-4 py-2 text-lg font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg transition-all duration-300"
          >
            Logout
            <AiOutlineLogout className="ml-2" />
          </Link>
        )}
      </div> */}
      <div
        className={`${
          isMobileNavVisible
            ? "translate-y-16 opacity-100"
            : "-translate-y-full opacity-0"
        } fixed top-0 left-0 w-full h-fit bg-white shadow-lg z-50 flex flex-col items-center py-10 transition-all duration-500 md:hidden`}
      >
        {/* Navigation Links */}
        <div className="w-4/5 flex flex-col gap-4">
          {roleLinks.map((item, index) => (
            <Link
              to={item.url}
              key={index}
              className="flex items-center gap-4 text-gray-700 text-lg p-3 rounded-lg bg-blue-50 hover:bg-blue-500 hover:text-white shadow transition-all duration-300"
              onClick={() => setMobileNavVisible(false)}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}

          {/* Book Appointment Button */}
          <Link
            to="/book-appointment"
            onClick={() => setMobileNavVisible(false)}
            className="text-center px-6 py-3 text-lg font-semibold text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white shadow transition-all duration-300"
          >
            Book Appointment
          </Link>

          {/* Authentication Buttons */}
          {!isLoggedIn ? (
            <Link
              to="/login"
              onClick={() => setMobileNavVisible(false)}
              className="flex items-center justify-center px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition-all duration-300"
            >
              Login <AiOutlineLogin className="ml-2" />
            </Link>
          ) : (
            <Link
              to="/"
              onClick={() => {
                handleLogout();
                setMobileNavVisible(false);
              }}
              className="flex items-center justify-center px-6 py-3 text-lg font-semibold bg-blue-500 text-white rounded-lg hover:bg-red-600 shadow transition-all duration-300"
            >
              Logout <AiOutlineLogout className="ml-2" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

