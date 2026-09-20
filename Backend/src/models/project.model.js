const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    requiredSkills: {
      type: [String],
      default: []
    },

    teamSize: {
      type: Number,
      required: true,
      min: 2,
      max: 6
    },

    deadline: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);