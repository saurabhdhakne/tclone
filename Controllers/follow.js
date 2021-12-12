const users = require("../database/models/user");

const mongoose = require("mongoose");

module.exports = (req, res) => {
  try {
    var url = `${process.env.db}`;
    allUsers = [];
    mongoose.connect(url, (err, db) => {
      if (err) {
        console.log("Unable to connect");
      } else {
        console.log(req.query.id);
        users.updateOne(
          { email: req.session.email, following: { $ne: req.query.id } },
          { $push: { following: req.query.id } },
          (err, result) => {
            console.log(result);
            if (err) throw err;
            if (result) {
              res.send("Success");
            } else {
              res.render("failed");
            }
          }
        );
      }
    });
  } catch (e) {
    res.send("No User Found...");
  }
};
