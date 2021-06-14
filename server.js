const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const session = require("express-session");const cookieParser = require('cookie-parser');

const jwt = require("jsonwebtoken");

// requiring local modules
const connectDB = require("./config/db");
const User = require("./models/userModel");
const { json } = require("express");
const { use } = require("passport");

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
  console.log(req.body.role);
  if(await req.body.password.length < 6){
    res.json({
      status: "length error",
      message: " password length should be 6 characters"
    })
  }
  else if (await req.body.password !== req.body.confirmPassword){
    console.log(req.body.password, req.body.confirmPassword);
    res.json({
      status: "not matched",
      message: "password does not match"
    })
  }
  else{
    const { userName, email, password: plainTextassword, role } = req.body;
    const password = await bcrypt.hash(plainTextassword, 10);
    await User.findOne({ email: email })
      .then((user) => {
        if (user) {
          res.json({
            status: "user exits",
            message: "user email is already taken"
          });
        } else {
          const newUser = new User({
            userName,
            email,
            password,
            role
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
      .catch((err) => console.log(err.message));
  }
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
    else{
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (isMatch) {
          const maxAge = 24 * 60 * 60
          const token = jwt.sign(
            {
              id: user._id,
              username: user.userName,
            },
            process.env.JWT_SECRET
          );
          res.cookie("jwt",token,{
            expiresIn: maxAge
          } )
          return res.json({
            status: "ok", 
            role: user.role
          })
        } else {
          return res.json({ status: "error", message: "entered password is incorrect" });
        }
      });
    }
  });
});

app.get("/dashbord", (req, res) => {
  const token = req.cookies.jwt
  if(token){
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken)=>{
      if(err){
        res.json({
          status: "error",
          message: "token is not verified"
        })
      }
      else{
        console.log(decodedToken);
        res.json({
          status:"ok",
          message:"token is verified"
        })
      }
    })
  }
  else{
    res.json({
      status: "no token",
      message: "token not found"
    })
  }
});
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
