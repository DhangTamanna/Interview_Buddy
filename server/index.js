require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());
mongoose.connect (process.env.MONGO_URL).then(()=>console.log("MongoDB Connected")).catch((error)=>console.log(error));

app.get("/", (req, res) => {
  res.send("InterviewBuddy Backend Running");
});
app.post("/login", (req, res) => {
  console.log(req.body);

  res.json({
    message: "Login successful",
  });
});
app.post("/signup", async (req, res) => {

  const { name, email, password } = req.body;

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
    password
  });
   await newUser.save();

  res.json({
    message: "Signup successful",
  });

});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
