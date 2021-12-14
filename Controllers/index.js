const users = require("../database/models/user");

const tweet = require("../database/models/tweet");

const mongoose = require("mongoose");

module.exports = async (req, res) => {
  try {
    var url = `${process.env.db}`;
    allUsers = [];
    logUser = [];
    fUser = [];
    nfUser = [];
    tweets = [];
    mongoose.connect(url, (err, db) => {
      if (err) {
        console.log("Unable to connect");
      } else {
        tweet.find({}, (err, result) => {
          if (err) throw err;
          if (result) {
            tweets = result;
          }
        });
        if (req.session.email) {
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
                res.render("index", {
                  logUser,
                  allUsers,
                  fUser,
                  nfUser,
                  tweets,
                });
              } else {
                res.render("index");
              }
            } else {
              res.render("index");
            }
          });
        } else {
          res.redirect("/login");
        }
      }
    });
  } catch (e) {
    res.send("No User Found...");
  }
};
