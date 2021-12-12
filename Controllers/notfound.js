const sha256 = require("sha256");

const user = require("../database/models/user");

const mongoose = require("mongoose");

module.exports = (req, res) => {
  try {
    var url = `${process.env.db}`;

    mongoose.connect(url, (err, db) => {
      if (err) {
        console.log("Unable to connect");
      } else {
        res.render("notfound");
      }
    });
  } catch (e) {
    res.send("No User Found...");
  }
};
