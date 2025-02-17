import React from "react";
// import TopAdminDash from "./components/AdminDashbordLinks/AdminComponents/TopAdminDash";
import Calendar from "../CommanComponents/Calendar";
// import WorkingHoursChart from "./AdminComponents/Chart";

// const patientDashboard = ({ user }) => {
//   return (
//     <div className="w-full h-[85vh] bg-gray-50 p-3">
//       <div className="w-full h-full bg-white rounded-xl overflow-y-scroll p-3 ">
//         <div className="m-3">
//           <h1 className="capitalize text-2xl font-semibold text-gray-600">
//             Welcome
//             <span className="text-3xl inline-block">👋</span>,{" "}
//             {user?.name}!
//           </h1>
//           <p className="text-xsm text-gray-400">
//             Check the latest update on your account.
//           </p>
//         </div>
//         <h1 className="text-xl font-semibold m-3 text-gray-500">Overwiew</h1>
//         <div className="w-full h-80vh flex gap-4">
//           <div className="w-full h-full flex flex-col gap-2">
//             <div className="w-full h-full flex gap-2">
//               {" "}
//               {/* <TopAdminDash />
//               <WorkingHoursChart /> */}
//             </div>
//             <div className="w-full h-80 rounded shadow-lg p-3">hello</div>
//           </div>

//           <div className="w-fit  h-full">
//             <Calendar />
//           </div>
//         </div>
//         {/* <TopAdminDash />
//         <Calendar/> */}
//       </div>
//     </div>
//   );
// };

// export default patientDashboard;


const PatientDashboard = ({ user, setActiveSection }) => {
  return (
    <div className="w-full min-h-[85vh] bg-gray-50 p-4">
      <div className="w-full h-full bg-white rounded-xl overflow-y-auto p-4 shadow-md">
        {/* Welcome Section */}
        <div className="m-4">
          <h1 className="capitalize text-2xl font-semibold text-gray-700">
            Welcome <span className="text-3xl inline-block">👋</span>,{" "}
            {user?.name}!
          </h1>
          <p className="text-sm text-gray-500">
            Check the latest updates on your account.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-4">
          <button
            onClick={() => setActiveSection("book-appointments")}
            className="w-full p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            📅 Book Appointment
          </button>
          <button className="w-full p-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">
            💊 View Prescriptions
          </button>
          <button className="w-full p-4 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600">
            📄 Check Reports
          </button>
        </div>

        {/* Overview Section */}
        <h1 className="text-xl font-semibold m-4 text-gray-600">Overview</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Appointments */}
          <div className="bg-white rounded-lg shadow-lg p-4 col-span-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Upcoming Appointments
            </h2>
            <ul className="mt-2 text-sm text-gray-600">
              <li className="py-2 border-b">📌 Dr. Smith - 10:00 AM, Feb 20</li>
              <li className="py-2 border-b">📌 Dr. Adams - 02:30 PM, Feb 22</li>
              <li className="py-2">📌 Dr. Lee - 09:00 AM, Feb 25</li>
            </ul>
          </div>

          {/* Health Stats Widget */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Health Stats
            </h2>
            <p className="text-sm text-gray-600">❤️ Heart Rate: 72 BPM</p>
            <p className="text-sm text-gray-600">🩸 Blood Pressure: 120/80</p>
            <p className="text-sm text-gray-600">🏋️ Weight: 70kg</p>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="mt-6">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
