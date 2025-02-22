const express = require("express");
const connectDB = require("./connection/connection");
const http = require("http");
const app = express();
const cors = require("cors");
const upload = require("./utils/upload");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

require("dotenv").config();
connectDB();

const user = require("./routes/user");
const Queue = require("./routes/queue");
const staff = require("./routes/staff");
const Room = require("./routes/room");
const Prescription = require("./routes/prescription");
const GeminiRoutes = require("./routes/geminiRoute");
const initializeSocketServer = require("./socketConnections/socket");

app.use(cors());
app.use(express.json());

app.use("/api/v1", user);
app.use("/api/v1", Room);
app.use("/api/v1", Queue);
app.use("/api/v1", staff);
app.use("/api/v1", Prescription);
app.use("/api/v1", GeminiRoutes);


// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.post("/upload", upload.single("file"), (req, res) => {
//   console.log("File Uploaded:", req.file);

//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   res.json({ filePath: `${req.file.filename}` });
// });
// Upload Route
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    // Cloudinary response is stored in req.file
    res.status(200).json({
      url: req.file.path, // Secure URL of the uploaded image
      filename: req.file.filename, // File name on Cloudinary
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => { 
  res.send("Welcome to Hospital Management System");
})

const PORT = process.env.PORT || 5000;
const server = http.createServer(app); // Create a server instance

initializeSocketServer(server); // Pass the HTTP server instance to Socket.io

server.listen(PORT, () => {
  console.log(`🚀 Server & Socket.io running on port ${PORT}`);
});

