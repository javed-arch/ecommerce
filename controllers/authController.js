import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/authUtils.js";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) return;
    const isPasswordValid = await comparePassword(
      req.body.password,
      userExist.password
    );
    if (!isPasswordValid) return;
    const token = jwt.sign(
      { id: userExist._id, isAdmin: userExist.isAdmin },
      process.env.jwtToken,
      { expiresIn: "1d" }
    );
    const { password, isAdmin, ...othersDetails } = userExist._doc;
    return res
      .status(200)
      .json({
        data: { ...othersDetails },
        token,
        isAdmin,
        message: "Lofin successfully",
        success: true,
      });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist)
      return res
        .status(409)
        .json({ message: "Email Already Exist", success: false, data: [] });
    if (req.body.password !== req.body.confirmPassword)
      return res
        .status(400)
        .json({ message: "Password Doesn't Match", success: false, data: [] });
    const newUser = new User({
      ...req.body,
      password: await hashPassword(req.body.password),
    });
    const savedUser = await newUser.save();
    const token = jwt.sign(
      { id: savedUser._id, isAdmin: savedUser.isAdmin },
      process.env.jwtToken,
      { expiresIn: "1d" }
    );
    const { password, isAdmin, ...othersDetails } = savedUser._doc;

    return res.status(201).json({
      message: "Successfully Created",
      data: { ...othersDetails },
      token,
      isAdmin,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
