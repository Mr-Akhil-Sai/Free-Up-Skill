const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const connectDB = require("./config/db");
const User = require("./model /model");

// load Config
dotenv.config({ path: "./config/config.env" });

// connecting to db
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

// load public files
app.use(express.static("public"));

// bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// morgan middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

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
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
            }
            newUser.password = hash;
            newUser
              .save()
              .then((result) => {
                console.log(result);
                res.sendFile(__dirname + "/public/login.html");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

app.listen(
  PORT,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
