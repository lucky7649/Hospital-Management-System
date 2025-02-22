import React, { createContext, useState, useContext } from "react";

// Create the context
const SidePanelContext = createContext();

// Provider component
export const SidePanelProvider = ({ children }) => {
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);

  // Toggle the visibility of the side panel
  const toggleSidePanel = () => {
    setIsSidePanelVisible((prev) => !prev);
  };

  return (
    <SidePanelContext.Provider value={{ isSidePanelVisible, toggleSidePanel }}>
      {children}
    </SidePanelContext.Provider>
  );
};

// Custom hook to use the context
export const useSidePanel = () => useContext(SidePanelContext);
