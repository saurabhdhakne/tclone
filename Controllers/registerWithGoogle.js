const mongoose = require("mongoose");

const sha256 = require("sha256");

const fs = require("fs");

const path = require("path");

const databases = require("../database/models/user");

module.exports = (req, res) => {
  var url = `${process.env.db}`;

  mongoose.connect(url, async (err, db) => {
    if (err) {
      console.log("Unable to connect");
    } else {
      console.log("connected");

      let user = await databases.findOne({
        email: req.user.emails[0].value,
      });
      if (!user) {
        databases.create(
          {
            fname: req.user.name.familyName,

            lname: req.user.name.givenName,

            email: req.user.emails[0].value,

            active: true,

            password: sha256(req.user.emails[0].value),
          },
          (error, post) => {
            console.log(error, post);
            req.session.email = req.user.emails[0].value;
            res.redirect("/loginSuccess");
          }
        );
      } else {
        req.session.email = req.user.emails[0].value;
        res.redirect("/loginSuccess");
        console.log(req.session.email);
        console.log("Logging User");
      }
    }
  });
};
