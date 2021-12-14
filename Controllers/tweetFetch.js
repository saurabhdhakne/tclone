const sha256 = require("sha256");

const tweet = require("../database/models/tweet");

const mongoose = require("mongoose");

module.exports = (req, res) => {
  try {
    var url = `${process.env.db}`;
    var tweets;

    mongoose.connect(url, async (err, db) => {
      try {
        if (err) {
          console.log("Unable to connect");
        } else {
          await tweet.find({}, (err, result) => {
            if (err) throw err;
            if (result) {
              tweets = result;
              res.send(tweets);
            }
          });
        }
      } catch (err) {
        res.redirect("/");
      }
    });
  } catch (e) {
    res.send("No User Found...");
  }
};
