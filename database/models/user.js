const mongoose = require("mongoose");

const DatabaseSchema = new mongoose.Schema({
  fname: String,

  lname: String,

  email: String,

  gender: {
    type: String,
    default: "Gender",
  },

  following: [],

  password: String,

  enc: String,

  active: Boolean,
});

const user = mongoose.model("user", DatabaseSchema);

module.exports = user;
