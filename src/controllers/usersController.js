const User = require("../models/userModal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedpassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedpassword,
    });

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
};
