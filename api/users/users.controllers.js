const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const hashPass = async (password) => {
  const coveredPass = await bcrypt.hash(password, 10);
  return coveredPass;
};
const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });
  return token;
};

exports.signup = async (req, res, next) => {
  try {
    const hashedPassword = await hashPass(req.body.password);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    return res.status(201).json({ token: token });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const token = generateToken(req.user);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
