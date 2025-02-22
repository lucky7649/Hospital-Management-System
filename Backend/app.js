const express = require("express");
const connectDB = require("./connection/connection");
const http = require("http");
const app = express();
const cors = require("cors");
const upload = require("./multer/upload");
const path = require("path");

require("dotenv").config();
connectDB();

const user = require("./routes/user");
const Queue = require("./routes/queue");
const staff = require("./routes/staff");
const Room = require("./routes/room");
const Prescription = require("./routes/prescription");
const GeminiRoutes = require("./routes/geminiRoute");
const initializeSocketServer = require("./socketConnections/socket");

app.use(
  cors({
    origin: "https://medicare-hms.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/v1", user);
app.use("/api/v1", Room);
app.use("/api/v1", Queue);
app.use("/api/v1", staff);
app.use("/api/v1", Prescription);
app.use("/api/v1", GeminiRoutes);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("File Uploaded:", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({ filePath: `${req.file.filename}` });
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

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const path = require("path");
// const connectDB = require("./connection/connection");
// const upload = require("./multer/upload");

// require("dotenv").config();
// connectDB();

// const app = express();
// const server = http.createServer(app); // ✅ HTTP Server बनाओ

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// //  Socket.io Setup
// io.on("connection", (socket) => {
//   console.log(`New socket connected: ${socket.id}`);

//   socket.on("room:join", ({ room }) => {
//     socket.join(room);
//     console.log(`👤 User ${socket.id} joined room: ${room}`);
//     socket.to(room).emit("user:joined", { id: socket.id });
//     io.to(socket.id).emit("room:join", { room });
//   });

//   socket.on("user:call", ({ to, offer }) => {
//     io.to(to).emit("incoming:call", { from: socket.id, offer });
//   });

//   socket.on("call:accepted", ({ to, answer }) => {
//     io.to(to).emit("call:accepted", { from: socket.id, answer });
//   });

//   socket.on("peer:nego:needed", ({ to, offer }) => {
//     io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
//   });

//   socket.on("peer:nego:done", ({ to, answer }) => {
//     io.to(to).emit("peer:nego:final", { from: socket.id, answer });
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

// // ✅ Middleware & Routes
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.post("/upload", upload.single("file"), (req, res) => {
//   console.log("File Uploaded:", req.file);
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }
//   res.json({ filePath: `${req.file.filename}` });
// });

// const user = require("./routes/user");
// const Queue = require("./routes/queue");
// const staff = require("./routes/staff");
// const Room = require("./routes/room");
// const Prescription = require("./routes/prescription");

// app.use("/api/v1", user);
// app.use("/api/v1", Room);
// app.use("/api/v1", Queue);
// app.use("/api/v1", staff);
// app.use("/api/v1", Prescription);

// // ✅ Start Server on Same Port
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server & Socket.io running on port ${PORT}`);
// });
