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
        users.find({}, (err, result) => {
          let allUsers = result.filter(function (res) {
            return res.email !== req.session.email;
          });

          let logUser = result.filter(function (res) {
            return res.email === req.session.email;
          });

          logUser = logUser[0];

          let fUser = allUsers.filter(function (usr) {
            return logUser.following.includes(usr._id);
          });

          let nfUser = allUsers.filter(function (usr) {
            return !logUser.following.includes(usr._id);
          });

          if (err) throw err;
          if (result) {
            if (req.session.email) {
              res.render("index", { logUser, allUsers, fUser, nfUser });
            } else {
              res.render("index");
            }
          } else {
            res.render("index");
          }
        });
      }
    });
  } catch (e) {
    res.send("No User Found...");
  }
};
