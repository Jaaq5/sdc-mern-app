// IMPORTS ####################################################################
const User = require("../models/userModel");
const mongoose = require("mongoose");

// GET #######################################################################
// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get one user
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user" });
    }

    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POSTS ######################################################################
// Post new user
const createUser = async (req, res) => {
  try {
    const { userName, userPersonalInfo } = req.body;
    const newUser = await User.create({
      userName,
      userPersonalInfo,
    });
    res.status(201).json({ newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE #####################################################################
// Delete one user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user" });
    }
    const user = await User.findOneAndDelete({ _id: id });
    if (!user) {
      return res.status(404).json({ error: "No such user" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE #####################################################################
// Update one user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user" });
    }
    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
    );
    if (!user) {
      return res.status(404).json({ error: "No such user" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// EXPORTS ####################################################################
module.exports = { createUser, getUsers, getUser, deleteUser, updateUser };
