// IMPORTS ####################################################################
const express = require("express");
const {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

// GET #######################################################################
router.get("/", getUsers);

router.get("/:id", getUser);

// POST ######################################################################
router.post("/", createUser);

// DELETE ###################################################################
router.delete("/:id", deleteUser);

// UPDATE ###################################################################
router.patch("/:id", updateUser);

// EXPORTS ####################################################################
module.exports = router;
