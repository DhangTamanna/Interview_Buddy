require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const User = require("./models/User");
const InterviewResult = require("./models/InterviewResult");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
// ======================= MULTER =======================

const upload = multer({
  dest: "uploads/",
});


// ======================= MIDDLEWARE =======================

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());


// ======================= DB CONNECT =======================

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


// ======================= HOME =======================

app.get("/", (req, res) => {
  res.send("InterviewBuddy Backend Running");
});


// ======================= AUTH =======================

// SIGNUP
app.post("/signup", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "Signup successful",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
});


// LOGIN
app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
});


// ======================= REAL AI QUESTION GENERATOR =======================

app.post("/api/ai/generate-questions", async (req, res) => {
  try {

    const { category, difficulty } = req.body;

    console.log(
      "OPENROUTER KEY:",
      process.env.OPENROUTER_API_KEY
    );

    const prompt = `
Generate exactly 5 interview questions.

Category: ${category}
Difficulty: ${difficulty}

Rules:
- Return ONLY valid JSON array
- No explanation
- No markdown

Example:
["Question 1", "Question 2"]
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",

      {
       model: "openrouter/free",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "InterviewBuddy",
        },
      }
    );

    let text =
      response.data.choices[0].message.content;

    text = text.replace(/```json|```/g, "").trim();

    console.log("AI RESPONSE:", text);

    let questions;

    try {

      questions = JSON.parse(text);

    } catch (err) {

      return res.status(500).json({
        message: "Invalid AI format",
      });
    }

    res.json({ questions });

  } catch (error) {

    console.log(
      "AI ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Failed to generate AI questions",
    });
  }
});
// ======================= AI ANSWER EVALUATION =======================

app.post("/api/ai/evaluate-answer", async (req, res) => {
  try {

    const { question, answer } = req.body;

    const prompt = `
You are a technical interview evaluator.

Evaluate the user's answer.

Question:
${question}

Answer:
${answer}

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- score must be integer only
- score between 1 and 10

Format:
{
  "score": 8,
  "feedback": "Good explanation with decent clarity."
}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "openrouter/free",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },

      {
        headers: {
          Authorization:
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
            "application/json",

          "HTTP-Referer":
            "http://localhost:5173",

          "X-Title":
            "InterviewBuddy",
        },
      }
    );

    let text =
      response.data.choices[0].message.content;

    text =
      text.replace(/```json|```/g, "")
      .trim();

    console.log(
      "RAW AI FEEDBACK:",
      text
    );

    let result =
      JSON.parse(text);

    result.score =
      parseInt(result.score) || 0;

    res.json(result);

  } catch (error) {

    console.log(
      "AI FEEDBACK ERROR:",
      error.response?.data ||
      error.message
    );

    res.status(500).json({
      message:
        "Failed to evaluate answer",
    });
  }
});
// ======================= RESUME AI INTERVIEW =======================

app.post(
  "/api/ai/resume-interview",
  upload.single("resume"),
  async (req, res) => {

    try {

      const pdfBuffer =
        fs.readFileSync(req.file.path);

      const pdfData =
        await pdfParse(pdfBuffer);

      const resumeText =
        pdfData.text;

      console.log(
        "RESUME TEXT:",
        resumeText
      );

      const prompt = `
You are an expert technical interviewer.

Based on this resume, generate exactly 5 personalized interview questions.

Resume:
${resumeText}

Rules:
- Questions must be realistic
- Questions must be technical
- Return ONLY JSON array
- No markdown
- No explanation

Example:
[
  "Question 1",
  "Question 2"
]
`;

      const response = await axios.post(

        "https://openrouter.ai/api/v1/chat/completions",

        {
          model: "openrouter/free",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },

        {
          headers: {
            Authorization:
              `Bearer ${process.env.OPENROUTER_API_KEY}`,

            "Content-Type":
              "application/json",

            "HTTP-Referer":
              "http://localhost:5173",

            "X-Title":
              "InterviewBuddy",
          },
        }
      );

      let text =
        response.data.choices[0]
        .message.content;

      text =
        text.replace(
          /```json|```/g,
          ""
        ).trim();

      console.log(
        "AI RESUME QUESTIONS:",
        text
      );

      const questions =
        JSON.parse(text);

      // delete uploaded file
      fs.unlinkSync(req.file.path);

      res.json({
        questions,
      });

    } catch (error) {

      console.log(
        "RESUME AI ERROR:",
        error.response?.data ||
        error.message
      );

      res.status(500).json({
        message:
          "Failed to generate resume interview",
      });
    }
  }
);
// ======================= UPDATE PROFILE =======================

app.put(
  "/update-profile",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        name,
        bio,
        skills,
        preferredInterviewType,
      } = req.body;

      const updatedUser =
        await User.findByIdAndUpdate(

          req.user.id,

          {
            name,
            bio,
            skills,
            preferredInterviewType,
          },

                {
          returnDocument: "after",
        }
        );

      res.json({

        message:
          "Profile updated successfully",

        user: updatedUser,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to update profile",
      });
    }
  }
);
// ======================= GET PROFILE =======================

app.get(
  "/profile",
  authMiddleware,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        ).select("-password");

      res.json(user);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Failed to fetch profile",
      });
    }
  }
);

// ======================= SAVE RESULT =======================

app.post("/save-result", authMiddleware, async (req, res) => {
  try {

    const { category, score, answers } = req.body;

    const result = new InterviewResult({
      userId: req.user.id,
      category,
      score,
      answers,
    });

    await result.save();

    res.status(201).json({
      message: "Saved successfully",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
});


// ======================= HISTORY =======================

app.get("/results", authMiddleware, async (req, res) => {
  try {

    const results = await InterviewResult.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(results);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
});


// ======================= SERVER =======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});