import { useEffect } from "react";

const GoogleTranslate = () => {
    useEffect(() => {
        // Prevent duplicate script injection
        if (document.querySelector('script[src*="translate.google.com"]')) return;

        // Create Google Translate script
        const script = document.createElement("script");
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.onerror = () => console.error("Failed to load Google Translate script.");
        document.body.appendChild(script);

        // Define Google Translate initialization function globally
        window.googleTranslateElementInit = () => {
            try {
                new window.google.translate.TranslateElement(
                    { pageLanguage: "en" },
                    "google_translate_element"
                );
            } catch (error) {
                console.error("Google Translate initialization failed:", error);
            }
        };
    }, []);

    return (
        <div className="flex justify-end p-4">
            <div id="google_translate_element" className="bg-gray-100 px-3 py-2 rounded-md shadow-md"></div>
        </div>
    );
};

export default GoogleTranslate;
