const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");

// requiring local modules
const connectDB = require("./config/db");
const User = require("./models/model");
const { json } = require("express");

// oauth
require("./config/oauth")(passport);

// load Config
dotenv.config({ path: "./config/config.env" });

// connecting to db
connectDB();

// specifing port
const PORT = process.env.PORT || 5000;

const app = express();

// load public files
app.use(express.static("public"));
// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// morgan middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes

// register route
app.post("/register", async (req, res) => {
  const { userName, email, password: plainTextassword } = req.body;
  const password = await bcrypt.hash(plainTextassword, 10);
  await User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.send("Entered email is already taken");
      } else {
        const newUser = new User({
          userName,
          email,
          password,
        });
        // saving user to db
        newUser
          .save()
          .then((result) => {
            console.log(result);
            res.json({
              status: "ok",
              message: "user registered",
            });
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

// Login with local
app.post("/login", async (req, res) => {
  await User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.json({
        status: "no user",
        message: "no user found",
      });
    }
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (isMatch) {
        const token = jwt.sign(
          {
            id: user._id,
            username: user.userName,
          },
          process.env.JWT_SECRET
        );
        return res.json({ status: "ok", data: token });
      } else {
        console.log(req.body.password === user.password);

        return res.json({ status: "error", message: "error" });
      }
    });
  });
});

// app.get("/dashbord", (req, res) => {
//   console.log(req.session.user);
//   if (!req.session.user) {
//     return res.status(401).send();
//   }
//   res.sendFile(__dirname + "/public/dashboard.html");
// });
// Login with google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login.html",
  }),
  (req, res) => {
    res.sendFile(__dirname + "/public/dashbord.html");
  }
);

app.listen(
  PORT,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
