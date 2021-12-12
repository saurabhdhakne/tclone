require("dotenv").config();

const bodyParser = require("body-parser");

const express = require("express");

const { config, engine } = require("express-edge");

const fs = require("fs");

const passport = require("passport");

require("./passport-setup");

// const expressSession = require("express-session");

const expressSession = require("express-session");

const mongoDBSession = require("connect-mongodb-session")(expressSession);

const path = require("path");

const app = new express();

var server = require("http").createServer(app);

var http = require("http");

var https = require("https");

const httpsOptions = {
  key: fs.readFileSync("./security/key.pem"),
  cert: fs.readFileSync("./security/server.crt"),
};

//Controllers
const indexRoute = require("./Controllers/index");
const registerWithGoogle = require("./Controllers/registerWithGoogle");
const notfound = require("./Controllers/notfound");
const follow = require("./Controllers/follow");

var jsonParser = bodyParser.json();

app.use(bodyParser.json({ limit: "10mb", extended: true }));

var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: "10mb" });

app.use(express.static("public"));

// Configure Edge if need to
config({ cache: process.env.NODE_ENV === "production" });

// Automatically sets view engine and adds dot notation to app.render
app.use(engine);

var url = `${process.env.db}`;

const store = new mongoDBSession({
  uri: url,
  collection: "mysession",
});

const IN_PROD = process.env.NODE_ENV === "production";

app.use(
  expressSession({
    name: process.env.SESSION_NAME, //setting custom name
    resave: false, // do not store if it never modified
    secret: process.env.SESSION_SECRETE, // secrete key which we dont't want expose to client
    saveUninitialized: false, //dont save the session which is empty
    store: store,

    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, //Session liftime
      sameSite: true,
      secure: IN_PROD, //set true when application is in production mode and false when it is in development mode
    },
  })
);

app.set("views", `${__dirname}/views`);

var data;

const redirectLoginUser = (req, res, next) => {
  if (!req.session.userType) {
    res.redirect("/signInUser");
  } else if (req.session.userType == "user") {
    next();
  } else {
    res.redirect("/signInUser");
  }
};

app.get("/", indexRoute);

app.get("/follow", follow);

app.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) throw err;
  });
  res.redirect("/");
});

// Google auth

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  if (req) {
    next();
  } else {
    res.send("Erro!! Try After some time...");
  }
};

app.get("/failed", (req, res) => res.send("You Failed to login!"));

app.get("/registerWithGoogle", (req, res) => {
  console.log(req);
  res.send("login success");
});

// app.get("/registerWithGoogle", isLoggedIn, (req, res) => { console.log(req.user);console.log(req.user.emails[0].value); res.send(`Welcome ${req.user.displayName}!`) } );

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  isLoggedIn,
  registerWithGoogle
);

app.use(notfound);

server.listen(process.env.PORT, () => {
  console.log(`HTTP App listening on port ${process.env.PORT}`);
});

const server2 = https
  .createServer(httpsOptions, app)
  .listen(`${process.env.PORT2}`, () => {
    console.log(`HTTPS App listening on port ${process.env.PORT2}`);
  });
