const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "supermanager", "manager"], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  videoUrl: { type: String, default: null },
});

module.exports = mongoose.model("User", UserSchema);
