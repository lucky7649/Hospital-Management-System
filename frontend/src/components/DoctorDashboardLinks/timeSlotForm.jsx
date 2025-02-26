// React component for adding time slots
import React, { useState, useEffect } from "react";
import axios from "axios";

const TimeSlotForm = () => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL;

      const [userId, setUserId] = useState(null);

      useEffect(() => {
        const storage = localStorage.getItem("userId");
        setUserId(storage); // Store in state for component-wide usage
      }, []);  
    
    
    
  const [formData, setFormData] = useState({
    day: "",
    startTime: "",
    endTime: "",
    interval: "",
    type: "",
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const types = ["in-person", "online"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.day ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.interval ||
      !formData.type
    ) {
      alert("Please fill all fields");
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/add-dynamic-slots/${userId}`,
        formData
      );
      alert("Time slots added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding time slots:", error);
      alert("Failed to add time slots.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-lg rounded-2xl max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold">Add Time Slots</h2>

      <select
        name="day"
        value={formData.day}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Day</option>
        {days.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>

      <input
        type="time"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
        placeholder="Start Time"
        className="w-full p-2 border rounded"
      />
      <input
        type="time"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        placeholder="End Time"
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        name="interval"
        value={formData.interval}
        onChange={handleChange}
        placeholder="Interval (in minutes)"
        className="w-full p-2 border rounded"
      />

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Type</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Slots
      </button>
    </form>
  );
};

export default TimeSlotForm;
