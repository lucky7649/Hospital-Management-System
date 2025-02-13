const router = require("express").Router();
require("dotenv").config();
const mongoose = require("mongoose");
const Queue = require("../models/queue");
const Patient = require("../models/patient");
const { authenticateToken } = require("./userAuth");
const Doctor = require("../models/staff");
const twilio = require("twilio");


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Function to send SMS



router.post("/send-sms", async (req, res) => {
  const { phoneNumber, message } = req.body;

  if (!phoneNumber||!message) {
    return res
      .status(400)
      .json({ error: "Phone number and message are required" });
  }

  try {
    const smsResponse = await client.messages.create({
      body: "Hello, your appointment is up!",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return res.status(200).json({ success: true, sid: smsResponse.sid });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});





router.post("/book-appointment", authenticateToken, async (req, res) => {
  try {
    const {
      doctorId,
      patientName,
      patientAge,
      gender,
      contactNumber,
      email,
      dateOfBirth,
      reasonForVisit,
      mode,
      appointmentDate,
    } = req.body;

    // Validate input
    if (
      !doctorId ||
      !patientName ||
      !patientAge ||
      !gender ||
      !contactNumber ||
      !reasonForVisit ||
      !mode ||
      !appointmentDate
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

  
    const queueEntry = new Queue({
      doctorId,
      patientId: req.user.id, // Ensure `req.user` is populated by authentication middleware
      patientName,
      patientAge,
      gender,
      contactNumber,
      email,
      dateOfBirth,
      reasonForVisit,
      status: "waiting",
      mode,
      appointmentDate,
      priority: false, // Set priority to false by default
    });

     
  await Patient.findByIdAndUpdate(req.user.id, {
    $push: { appointments: queueEntry._id },
  });
    await queueEntry.save();

    res
      .status(201)
      .json({ message: "Appointment booked successfully.", queueEntry });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.get("/appointments/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid doctor ID format." });
    }

    const doctorId = id;
    const appointments = await Queue.find({ doctorId }).populate(
      "patientId",
      ["name", "age", "avatar", "email", "phone", "city", "state", "country", "prescription", "medicalHistory", "gender", "dateOfBirth", "street", "username"]
    );
     


    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No appointments found for this doctor." });
    }

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error(`Error fetching appointments for doctor ID :`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/find-patient-appointments/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid doctor ID format." });
    }

    const patientId = id;
    const appointments = await Queue.find({ patientId });

    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No appointments found for this patient." });
    }

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error(`Error fetching appointments for patient ID ${id}:`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/update-appointment/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid appointment ID format." });
    }

    const appointment = await Queue.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Save changes before sending a response
    await appointment.save();

    return res.json({ success: true, data: appointment }); // Ensure response is returned
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" }); // Return to prevent multiple responses
  }
});

module.exports = router;
