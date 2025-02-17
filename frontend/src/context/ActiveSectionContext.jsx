import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const ActiveSectionContext = createContext();

// Create a Provider Component
export const ActiveSectionProvider = ({ children }) => {
  const savedActiveSection = localStorage.getItem("activeSection");
  const [activeSection, setActiveSection] = useState(
    savedActiveSection || "dashboard"
  );

  // Store active section in localStorage
  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ActiveSectionContext.Provider>
  );
};

// Custom Hook for easy access
export const useActiveSection = () => {
  return useContext(ActiveSectionContext);
};
