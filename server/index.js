require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const InterviewResult = require("./models/InterviewResult");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// DB CONNECT
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// HOME
app.get("/", (req, res) => {
  res.send("InterviewBuddy Backend Running");
});


// ======================= AUTH =======================

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// LOGIN (stores token in response)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
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
    res.status(500).json({ message: err.message });
  }
});


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

    res.status(201).json({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================= HISTORY (IMPORTANT FIX) =======================
app.get("/results", authMiddleware, async (req, res) => {
  try {
    const results = await InterviewResult.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});