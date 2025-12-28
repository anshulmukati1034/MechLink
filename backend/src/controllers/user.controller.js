const db = require("../models/model.js");
const crypto = require("crypto");
const generateToken = require("../lib/utils.js");
const bcrypt = require("bcryptjs");
const sendOTP = require("../lib/mailer.js");

const User = db.User;

exports.sendOtp = async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email) {
      return res.status(400).json({ message: "Email required" });
    }

    let user = await User.findOne({ where: { Email } });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    if (!user) {
      user = await User.create({
        Email,
        Name: null,
        Password: null,
        isVerified: false,
      });
    }

    user.otp = otp;
    user.otp_expires = otpExpiry;
    await user.save(); 

    await sendOTP(Email, otp);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({ message: "OTP send failed" });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { Email, Otp } = req.body;

    const user = await User.findOne({ where: { Email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== Otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otp_expires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await user.update({
      isVerified: true,
      otp: null,
      otp_expires: null,
    });

    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

exports.signupWithOtp = async (req, res) => {
  try {
    const { Name, Email, Password } = req.body;

    if (!Name || !Password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ where: { Email } });

    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    if (user.Password !== null) {
      return res.status(400).json({ message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    await user.update({
      Name,
      Password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user.id, res);
    console.log("Generated Token:", token);

    res.status(201).json({
      success: true,
      token,
      message: "Signup completed",
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
};

// exports.signup = async (req, res) => {
//   try {
//     const { Name, Email, Password } = req.body;

//     // Check user exists
//     const existingUser = await User.findOne({ where: { Email } });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(Password, salt);

//     // Create user
//     const user = await User.create({
//       Name,
//       Email,
//       Password: hashedPassword,
//       role_id: 1,
//     });

//     // Generate token
//     const token = generateToken(user.id, res);

//     res.status(201).json({
//       message: "User registered successfully",
//       token,
//       user: {
//         id: user.id,
//         name: user.Name,
//         email: user.Email,
//         role_id: user.role_id,
//       },
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

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
