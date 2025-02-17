// import React from "react";
// import {
//   FaMapMarkerAlt,
//   FaEnvelope,
//   FaPhone,
//   FaFacebook,
//   FaTwitter,
//   FaInstagram,
// } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white py-10">
//       <div className="w-full flex gap-20 mx-20 justify-around">
//         {/* Left Section - Hospital Info */}
//         <div className="w-1/3">
//           <h2 className="text-2xl font-bold mb-3">Medicare</h2>
//           <p className="text-gray-400">
//             Providing quality healthcare services with expert doctors and
//             advanced medical facilities.
//           </p>
//         </div>

//         {/* Middle Section - Contact Info */}
//         <div className="w-1/3">
//           <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
//           <div className="flex items-center space-x-3 mb-2">
//             <FaMapMarkerAlt className="text-blue-400" />
//             <p>123 Health St, Bhopal, India</p>
//           </div>
//           <div className="flex items-center space-x-3 mb-2">
//             <FaEnvelope className="text-blue-400" />
//             <p>support@yourhospital.com</p>
//           </div>
//           <div className="flex items-center space-x-3">
//             <FaPhone className="text-blue-400" />
//             <p>+91 98765 43210</p>
//           </div>
//         </div>

//         {/* Right Section - Quick Links & Social */}
//         <div className="w-1/3">
//           <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
//           <div className="flex flex-col space-y-2 text-gray-400">
//             <a href="#" className="hover:text-white">
//               About
//             </a>
//             <a href="#" className="hover:text-white">
//               Departments
//             </a>
//             <a href="#" className="hover:text-white">
//               Doctors
//             </a>
//             <a href="#" className="hover:text-white">
//               Contact
//             </a>
//           </div>
//           <h3 className="text-xl font-semibold mt-4 mb-3">Follow Us</h3>
//           <div className="flex space-x-4">
//             <a href="#" className="text-blue-400 hover:text-white">
//               <FaFacebook size={20} />
//             </a>
//             <a href="#" className="text-blue-400 hover:text-white">
//               <FaTwitter size={20} />
//             </a>
//             <a href="#" className="text-blue-400 hover:text-white">
//               <FaInstagram size={20} />
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Copyright */}
//       <div className="text-center text-gray-500 mt-10 border-t border-gray-700 pt-5">
//         &copy; {new Date().getFullYear()} Your Hospital Name. All Rights
//         Reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import React from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="w-full flex flex-col md:flex-row gap-10 md:gap-20 mx-auto max-w-7xl justify-between text-center md:text-left">
        {/* Left Section - Hospital Info */}
        <div className="md:w-1/3">
          <h2 className="text-2xl font-bold mb-3">Medicare</h2>
          <p className="text-gray-400">
            Providing quality healthcare services with expert doctors and
            advanced medical facilities.
          </p>
        </div>

        {/* Middle Section - Contact Info */}
        <div className="md:w-1/3">
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
            <FaMapMarkerAlt className="text-blue-400" />
            <p>123 Health St, Bhopal, India</p>
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
            <FaEnvelope className="text-blue-400" />
            <p>support@yourhospital.com</p>
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <FaPhone className="text-blue-400" />
            <p>+91 98765 43210</p>
          </div>
        </div>

        {/* Right Section - Quick Links & Social */}
        <div className="md:w-1/3">
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <div className="flex flex-col space-y-2 text-gray-400">
            <a href="#" className="hover:text-white">
              About
            </a>
            <a href="#" className="hover:text-white">
              Departments
            </a>
            <a href="#" className="hover:text-white">
              Doctors
            </a>
            <a href="#" className="hover:text-white">
              Contact
            </a>
          </div>
          <h3 className="text-xl font-semibold mt-4 mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="text-blue-400 hover:text-white">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="text-blue-400 hover:text-white">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-blue-400 hover:text-white">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 mt-10 border-t border-gray-700 pt-5">
        &copy; {new Date().getFullYear()} Your Hospital Name. All Rights
        Reserved.
      </div>
    </footer>
  );
};

export default Footer;
