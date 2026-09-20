const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// A student should not be able to create
// multiple requests for the same project.
joinRequestSchema.index(
  { project: 1, user: 1 },
  { unique: true }
);

module.exports = mongoose.model("JoinRequest", joinRequestSchema);