import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Controller

export const registerUser = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    const checkExistingUsers = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUsers) {
      return res.status(400).json({
        success: false,
        message:
          "User is already exist either with same username or same email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();

    if (newUser) {
      return res.status(201).json({
        success: true,
        message: "New User created successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "something wen wrong",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred! Please try again",
    });
  }
};
// Login Controller
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exists",
      });
    }
    // check for password and hash password

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    // create user token

    const accessToken = jwt.sign(
      {
        userID: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred! Please try again",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userID = req.userInfo.userID;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect! Please try again",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred! Please try again",
    });
  }
};

