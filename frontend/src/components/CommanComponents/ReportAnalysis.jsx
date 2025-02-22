import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FaCloudUploadAlt, FaPaperPlane, FaSpinner } from "react-icons/fa";

function ReportAnalysis({ onBack }) {
  const [symptoms, setSymptoms] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSymptomsChange = (e) => setSymptoms(e.target.value);
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("symptoms", symptoms);
      if (file) formData.append("file", file);

      const result = await axios.post(
        "http://localhost:1000/api/v1/report-analysis",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResponse(result.data.response);
    } catch (error) {
      setError("An error occurred while checking the symptoms.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <button
        onClick={onBack}
        className="flex absolute top-4 left-4 p-2 bg-blue-500   items-center text-white hover:bg-bluemb-4"
      >
        Back
      </button>
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
        AI Report Analysis
      </h1>

    
      <form onSubmit={handleSubmit} className="space-y-4">

        <label className="block w-full cursor-pointer bg-blue-50 border border-blue-300 text-blue-500 text-center py-3 rounded-lg hover:bg-blue-100 transition duration-200">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.txt,.png,.jpg,.jpeg"
            className="hidden"
          />
          <FaCloudUploadAlt className="inline-block mr-2 text-xl" />
          {file ? file.name : "Upload Medical Report (Optional)"}
        </label>
        <div className="mb-4 max-h-80 overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-inner">
          {/* AI Response */}
          {response && (
            <div className="flex flex-col space-y-2">
              <div className="self-start bg-blue-100 text-gray-800 p-3 rounded-lg shadow-md max-w-xs">
                <h3 className="font-semibold text-blue-600">AI Response:</h3>
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </div>
        {/* Text Input */}
        <textarea
          value={symptoms}
          onChange={handleSymptomsChange}
          placeholder="Describe your symptoms here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 resize-none"
          rows="3"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white flex items-center justify-center gap-2 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
          {loading ? "Processing..." : "Check Symptoms"}
        </button>
      </form>
    </div>
  );
}

export default ReportAnalysis;
