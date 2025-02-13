// import { useEffect, useState } from "react";

// const GoogleTranslate = () => {
//     const [showPopup, setShowPopup] = useState(false);

//     useEffect(() => {
//         // Show popup only once per session
//         if (!sessionStorage.getItem("translatePopupShown")) {
//             setShowPopup(true);
//             sessionStorage.setItem("translatePopupShown", "true");
//         }

//         // Prevent duplicate script injection
//         if (document.querySelector('script[src*="translate.google.com"]')) return;

//         // Create Google Translate script
//         const script = document.createElement("script");
//         script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//         script.async = true;
//         script.onerror = () => console.error("Failed to load Google Translate script.");
//         document.body.appendChild(script);

//         // Define Google Translate initialization function globally
//         window.googleTranslateElementInit = () => {
//             try {
//                 new window.google.translate.TranslateElement(
//                     { pageLanguage: "en" },
//                     "google_translate_element"
//                 );
//             } catch (error) {
//                 console.error("Google Translate initialization failed:", error);
//             }
//         };
//     }, []);

//     return (
//       <>
//         {/* Popup Modal */}
//         {showPopup && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//             <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-sm w-full text-center animate-fadeIn">
//               {/* Heading */}
//               <h2 className="text-xl font-bold text-gray-800">
//                 Language Selection
//               </h2>
//               <p className="text-sm text-gray-600 mt-2">
//                 You can translate this page using Google Translate.
//               </p>

//               {/* Google Translate Element */}
//               <div
//                 id="google_translate_element"
//                 className="bg-gray-100 px-4 py-2 rounded-lg shadow mt-4 border border-gray-200 relative overflow-hidden"
//               ></div>

//               {/* Close Button */}
//               <button
//                 onClick={() => setShowPopup(false)}
//                 className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         )}
//       </>
//     );
// };

// export default GoogleTranslate;


import { useEffect, useState, useRef } from "react";

const GoogleTranslate = () => {
  const [showPopup, setShowPopup] = useState(false);
  const scriptLoaded = useRef(false);
  const scriptElement = useRef(null);

  useEffect(() => {
    if (!sessionStorage.getItem("translatePopupShown")) {
      setShowPopup(true);
      sessionStorage.setItem("translatePopupShown", "true");
    }

    if (scriptLoaded.current) return; // Prevent multiple script injections
    scriptLoaded.current = true;

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error("Failed to load Google Translate script.");
    };
    script.onload = () => {
      console.log("Google Translate script loaded successfully.");
    };

    // Store the script reference for cleanup
    scriptElement.current = script;

    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      const initTranslation = () => {
        if (
          window.google &&
          window.google.translate &&
          window.google.translate.TranslateElement
        ) {
          console.log("Google Translate initialized.");
          new window.google.translate.TranslateElement(
            { pageLanguage: "en" },
            "google_translate_element"
          );
        } else {
          console.warn("Google Translate not ready, retrying...");
          setTimeout(initTranslation, 500); // Retry initialization after 500ms
        }
      };

      console.log("Attempting to initialize Google Translate...");
      initTranslation(); // Call the function to initialize translation
    };

    return () => {
      // Cleanup: Only remove the script if it's still in the DOM
      if (
        scriptElement.current &&
        document.body.contains(scriptElement.current)
      ) {
        document.body.removeChild(scriptElement.current);
      }
    };
  }, []);

  return (
    <div className="text-center">
   

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-sm w-full text-center animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800">
              Language Selection
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              You can translate this page using Google Translate.
            </p>

            {/* Google Translate Element */}
            <div
              id="google_translate_element"
              className="bg-gray-100 px-4 py-2 rounded-lg shadow mt-4 border border-gray-200"
              aria-label="Google Translate Dropdown"
            ></div>

            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleTranslate;

// import { useEffect, useState } from "react";

// const GoogleTranslate = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [scriptLoaded, setScriptLoaded] = useState(false);

//   useEffect(() => {
//     if (!scriptLoaded) return;

//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         { pageLanguage: "en" },
//         "google_translate_element"
//       );
//     };

//     return () => {
//       delete window.googleTranslateElementInit;
//     };
//   }, [scriptLoaded]);

//   const loadGoogleTranslate = () => {
//     if (scriptLoaded || document.getElementById("google-translate-script"))
//       return;

//     const script = document.createElement("script");
//     script.id = "google-translate-script";
//     script.src =
//       "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//     script.async = true;
//     script.onload = () => setScriptLoaded(true);
//     script.onerror = () =>
//       console.error("Failed to load Google Translate script.");
//     document.body.appendChild(script);
//   };

//   return (
//     <div className="relative flex justify-end p-4">
//       <button
//         onClick={() => {
//           setShowPopup(true);
//           loadGoogleTranslate();
//         }}
//         className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         aria-label="Open language translation popup"
//       >
//         Translate
//       </button>

//       {showPopup && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
//           aria-modal="true"
//           role="dialog"
//         >
//           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
//             <h2 className="text-xl font-bold text-gray-800">
//               Language Selection
//             </h2>
//             <p className="text-sm text-gray-600 mt-2">
//               You can translate this page using Google Translate.
//             </p>
//             <div id="google_translate_element" className="mt-4"></div>
//             <button
//               onClick={() => setShowPopup(false)}
//               className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               aria-label="Close translation popup"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GoogleTranslate;

// import { useEffect, useState, useRef } from "react";

// const GoogleTranslate = () => {
//   const [showPopup, setShowPopup] = useState(false);
//   const scriptLoaded = useRef(false);

//   useEffect(() => {
//     if (!sessionStorage.getItem("translatePopupShown")) {
//       setShowPopup(true);
//       sessionStorage.setItem("translatePopupShown", "true");
//     }

//     if (scriptLoaded.current) return;
//     scriptLoaded.current = true;

//     const script = document.createElement("script");
//     script.src =
//       "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//     script.async = true;
//     script.defer = true;
//     script.onerror = () =>
//       console.error("Failed to load Google Translate script.");
//     document.body.appendChild(script);

//     window.googleTranslateElementInit = () => {
//       const initTranslation = () => {
//         if (
//           window.google &&
//           window.google.translate &&
//           window.google.translate.TranslateElement
//         ) {
//           new window.google.translate.TranslateElement(
//             { pageLanguage: "en" },
//             "google_translate_element"
//           );
//         } else {
//           console.warn("Google Translate not ready, retrying...");
//           setTimeout(initTranslation, 500); // Retry after 500ms
//         }
//       };
//       initTranslation();
//     };

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <>
//       {showPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-sm w-full text-center animate-fadeIn">
//             <h2 className="text-xl font-bold text-gray-800">
//               Language Selection
//             </h2>
//             <p className="text-sm text-gray-600 mt-2">
//               You can translate this page using Google Translate.
//             </p>

//             <div
//               id="google_translate_element"
//               className="bg-gray-100 px-4 py-2 rounded-lg shadow mt-4 border border-gray-200"
//               aria-label="Google Translate Dropdown"
//             ></div>

//             <button
//               onClick={() => setShowPopup(false)}
//               className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default GoogleTranslate;

