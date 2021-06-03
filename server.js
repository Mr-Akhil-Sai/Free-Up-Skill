const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");

// requiring local modules
const connectDB = require("./config/db");
const User = require("./models/model");

require("./config/oauth")(passport);
// load Config
dotenv.config({ path: "./config/config.env" });

// connecting to db
connectDB();

// specifing port
const PORT = process.env.PORT || 5000;

const app = express();

// load public files
app.use(express.static("public/homePage"));
// bodyparser
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
app.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.send("Entered email is already taken");
      } else {
        const newUser = new User({
          name,
          email,
          password,
          confirmPassword,
        });
        // encrypting the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
            }
            newUser.password = hash;
            // saving user to db
            newUser
              .save()
              .then((result) => {
                console.log(result);
                res.sendFile(
                  __dirname + "/public/homePage/loginSignup/login.html"
                );
              })
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

// Login route
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
    res.sendFile(__dirname + "/public/homePage/loginSignup/dashbord.html");
  }
);

app.listen(
  PORT,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
