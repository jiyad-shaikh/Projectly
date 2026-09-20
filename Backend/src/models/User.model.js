const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    course: {
      type: String,
      required: true,
      trim: true
    },

    year: {
      type: String,
      required: true
    },

    bio: {
      type: String,
      default: "",
      trim: true
    },
    portfolio: {
      type: String,
      default: "",
      trim: true
    },

    skills: {
      type: [String],
      default: []
    },

    interests: {
      type: [String],
      default: []
    },

    profileImage: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);