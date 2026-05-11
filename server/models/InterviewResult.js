const mongoose = require("mongoose");

const interviewResultSchema = new mongoose.Schema({

  userId: {
    type: String,
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
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  }

});

module.exports = mongoose.model(
  "InterviewResult",
  interviewResultSchema
);