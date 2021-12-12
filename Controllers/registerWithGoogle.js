const mongoose = require("mongoose");

const sha256 = require("sha256");

const fs = require("fs");

const path = require("path");

const databases = require("../database/models/user");

module.exports = (req, res) => {
  var url = `${process.env.db}`;

  mongoose.connect(url, (err, db) => {
    if (err) {
      console.log("Unable to connect");
    } else {
      console.log("connected");
      databases.findOne({ email: req.user.emails[0].value }, (err, result) => {
        if (err) throw err;
        if (result) {
          // res.send("Account Associalted with this Email is Already Exsist!!");
          req.session.userType = "user";
          req.session.email = req.user.emails[0].value;
          res.redirect("/");
        } else {
          toEmail = req.user.emails[0].value;
          fname = req.user.name.familyName;
          lname = req.user.name.givenName;
          password = req.user.emails[0].value;

          console.log(toEmail);
          console.log(fname);
          console.log(lname);

          databases.create(
            {
              fname: fname,

              lname: lname,

              email: toEmail,

              active: true,

              password: sha256(password),
            },
            (error, post) => {
              console.log(error, post);
            }
          );
          req.session.email = req.user.emails[0].value;
          res.redirect("/");
        }
      });
    }
  });
};
