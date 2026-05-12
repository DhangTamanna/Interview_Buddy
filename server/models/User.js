const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  bio: {
    type: String,
    default: "",
  },

  skills: {
    type: [String],
    default: [],
  },

  preferredInterviewType: {
    type: String,
    default: "",
  },

});

module.exports = mongoose.model("User", UserSchema);