const mongoose = require("mongoose");
const chatSchema = mongoose.Schema({
  sender_id: { type: mongoose.Types.ObjectId, ref: "user" },
  text: String,
  time: { type: Date, default: Date.now },
});
const ChatModel = mongoose.model("chat", chatSchema);
module.exports = { ChatModel };
