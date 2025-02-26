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
    const { doctorId, reasonForVisit, timeSlot, mode, appointmentDate } =
      req.body;

    // Validate input
    if (
      !doctorId ||
      !timeSlot ||
      !reasonForVisit ||
      !mode ||
      !appointmentDate
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate ObjectId format for doctorId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID." });
    }

    // Validate appointmentDate (should not be in the past)
 const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00
const selectedDate = new Date(appointmentDate);
if (selectedDate < currentDate) {
  return res
    .status(400)
    .json({ message: "Appointment date cannot be in the past." });
    }
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }


  const isSlotBooked = await Queue.findOne({
  doctorId,
  timeSlot,
  appointmentDate,
  status: { $ne: "Cancelled" }, // Exclude cancelled appointments
});

    if (isSlotBooked) {
      return res.status(409).json({ message: "Time slot is already booked." });
    }

    let roomId = null;
    if (mode === "online") {
      roomId = `${doctorId}-${req.user.id}-${Date.now()}`;
    }

    
    const queueEntry = new Queue({
      doctorId,
      patientId: req.user.id,
      reasonForVisit,
      status: "Pending",
      mode,
      timeSlot,
      appointmentDate,
      priority: false,
      roomId,
    });


    await Promise.all([
      Patient.findByIdAndUpdate(req.user.id, {
        $push: { appointments: queueEntry._id },
      }),
      queueEntry.save(),
    ]);

    res.status(201).json({
      message: "Appointment booked successfully.",
      queueEntry,
    });
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
    const appointments = await Queue.find({ doctorId })
      .populate("patientId") // Populate all fields for patient
      .populate("doctorId"); // Populate all fields for doctor

    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No appointments found for this doctor." });
    }

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error(`Error fetching appointments for doctor ID:`, error);
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
    const appointments = await Queue.find({ patientId })
      .populate("patientId", "name age gender");
    

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
