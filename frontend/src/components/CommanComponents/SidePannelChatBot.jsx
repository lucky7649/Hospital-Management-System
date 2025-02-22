import React, { useState } from "react";
import SymptomsChecker from "./SymptomChecker";
import { useSidePanel } from "../../context/sidePannelContext";
import { FaTimes } from "react-icons/fa";
import { LuBot } from "react-icons/lu";
import ReportAnalysis from "./ReportAnalysis";

const SidePannelChatBot = () => {
  const { toggleSidePanel, isSidePanelVisible } = useSidePanel();
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div
      className={`fixed right-0 top-0 z-40 h-screen w-[40%] p-6 transition-transform duration-300 rounded-l-2xl shadow-2xl bg-gradient-to-br from-blue-50 to-blue-100 ${
        isSidePanelVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close Button */}
      <div
        onClick={toggleSidePanel}
        className="p-4 rounded-xl bg-gray-200 shadow-ms absolute top-8 right-8 cursor-pointer"
      >
        <FaTimes />
      </div>

      {/* Show Options Screen */}
      {selectedOption === null ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          {/* Welcome Text */}
          <div className="bg-white rounded-lg shadow-md p-6 w-11/12 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to Your AI Health Assistant!
            </h2>
            <p className="text-gray-600 text-sm">
              Choose an option below to get started.
            </p>
          </div>

          {/* Buttons for options */}
          <div className="mt-6 flex gap-4">
            <button
              className="flex gap-2 items-center px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
              onClick={() => setSelectedOption("symptoms")}
            >
              Symptoms Checker <LuBot size={20} />
            </button>

            <button
              className="flex gap-2 items-center px-6 py-3 text-lg font-medium text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition duration-200"
              onClick={() => setSelectedOption("report")}
            >
              Report Analysis <LuBot size={20} />
            </button>
          </div>
        </div>
      ) : selectedOption === "symptoms" ? (
        <SymptomsChecker onBack={() => setSelectedOption(null)} />
      ) : (
        <ReportAnalysis onBack={() => setSelectedOption(null)} />
      )}
    </div>
  );
};

export default SidePannelChatBot;
