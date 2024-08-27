// IMPORTS ####################################################################
const mongoose = require("mongoose");

// SCHEMA #####################################################################
const Schema = mongoose.Schema;

// USER #######################################################################
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userPersonalInfo: {
      userEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
      userPhone: {
        type: String,
        trim: true,
      },
      userAddress: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true },
);

// EXPORTS ####################################################################
const User = mongoose.model("User", userSchema);

module.exports = User;
