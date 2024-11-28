const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter a name"],
    trim: true,
    maxlenght: [20, "name cannot exceed 20 chracters"],
  },
  completed: {
    type: Boolean,
    default: false,
  }
})

const User = mongoose.model("User", UserSchema);
module.exports = User