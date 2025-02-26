const { Server } = require("socket.io");

const initializeSocketServer = (PORT) => {
  const io = new Server(PORT, {
    cors: {
      origin: ["http://localhost:3000", "https://medicare-hms.vercel.app"],
      methods: ["GET", "POST"],
    },
  });

  const emailToSocketIdMap = new Map();
  const socketidToEmailMap = new Map();

  io.on("connection", (socket) => {
    console.log(`Socket Connected`, socket.id);

    socket.on("room:join", ({ room }) => {
      socket.join(room);
      io.to(room).emit("user:joined", { id: socket.id });
      io.to(socket.id).emit("room:join", { room });
    });

    socket.on("user:call", ({ to, offer }) => {
      io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
      io.to(to).emit("call:accepted", { from: socket.id, ans });
    });
     socket.on("call-started", (remoteSocketId) => {
       io.to(remoteSocketId).emit("call-started");
     });

    socket.on("peer:nego:needed", ({ to, offer }) => {
      console.log("peer:nego:needed", offer);
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
      console.log("peer:nego:done", ans);
      io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });
      socket.on("call:ended", ({ to }) => {
        console.log(`Call ended by ${socket.id}, notifying ${to}`);
        io.to(to).emit("call:ended");
      });
    socket.on("video:toggled", ({ to, isOn }) => {
      io.to(to).emit("video:toggled", { isOn });
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initializeSocketServer;
