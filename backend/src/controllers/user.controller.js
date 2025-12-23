const db = require("../models/model.js");
const generateToken = require("../lib/utils.js");
const bcrypt = require("bcryptjs");

const User = db.User;


exports.signup = async (req, res) => {
  try {
    const { Name, Email, Password } = req.body;
   
    if (!Name || !Email || !Password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check user exists
    const existingUser = await User.findOne({ where: { Email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create user
    const user = await User.create({
      Name,
      Email,
      Password: hashedPassword,
      role_id: 1, // default role as user
    });

    // Generate token
    const token = generateToken(user.id, res);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.Name,
        email: user.Email,
        role_id: user.role_id,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // 1. Validation
    if (!Email || !Password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Find user
    const user = await User.findOne({ where: { Email } });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user.id, res);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.FullName,
        email: user.Email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
