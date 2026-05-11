require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const authMiddleware = require("./middleware/authMiddleware");
const InterviewResult = require("./models/InterviewResult");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect (process.env.MONGO_URL).then(()=>console.log("MongoDB Connected")).catch((error)=>console.log(error));

app.get("/", (req, res) => {
  res.send("InterviewBuddy Backend Running");
});
router.post("/signup", async (req, res) => {

  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  const newUser = new User({
    name,
    email,
    password : hashedPassword,
  });
   await newUser.save();

  res.json({
    message: "Signup successful",
  });

});
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    // 1. Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // 3. Generate JWT token
          const token = jwt.sign(
        { id: user._id },
        "mysecretkey",
        { expiresIn: "7d" }
      );
     console.log(token);
    // 4. Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.user.id
  });
});
router.post("/save-result", authMiddleware, async (req, res) => {

  try {

    console.log(req.body);

    const { category, score, answers } = req.body;

    const newResult = new InterviewResult({
      userId: req.user.id,
      category,
      score,
      answers,
    });

    await newResult.save();

    res.status(201).json({
      message: "Interview result saved",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});
app.use("/",router);
// server start
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
