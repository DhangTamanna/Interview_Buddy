const mongoose = require("mongoose");

const interviewResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    answers: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewResult", interviewResultSchema);