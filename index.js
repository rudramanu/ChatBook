const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/user.route");
const { ChatModel } = require("./models/chat.model");
const http = require("http");
const { Server } = require("socket.io");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome");
});
app.use("/user", userRouter);

const httpServer = http.createServer(app);
httpServer.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Getting trouble while connecting to DB");
  }
  console.log(`Server is running at port ${process.env.port}`);
});

const io = new Server(httpServer);
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("details", async (el) => {
    const payload = {
      sender_id: el._id,
      username: el.username,
      text: "Joined",
    };
    const message = new ChatModel(payload);
    await message.save();
    socket.broadcast.emit("message", payload);
  });
});
