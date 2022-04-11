const mongoose = require("mongoose");

const process = mongoose.model("proces", mongoose.Schema({
  id:{ type: Number, default: 0 },
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  type: { type: String, default: "" },
  text: { type: String, default: "" },
  time: { type: Number, default: Date.now() },
}));

module.exports = process
