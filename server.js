const express = require("express");
// const passport = require("passport")
const dotenv = require("dotenv");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const session = require("express-session")

// requiring local modules
const connectDB = require("./config/db");
const User = require("./models/userModel");
const question = require("./models/questionsModel");
// require("./config/oauth")(passport)

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
app.use(express.urlencoded({extended: true}))

// morgan middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// express session
// app.use(
//   session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

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

//Local Login route
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

// Login with google route
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile"] })
//   );
// Google auth call back
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login.html",
//   }),
//   (req, res) => {
    // const maxAge = 24 * 60 * 60
    // const token = jwt.sign(
    //   {
    //     username: displayName,
    //   },
    //   process.env.JWT_SECRET
    // );
    // res.cookie("jwt",token,{
    //   expiresIn: maxAge
    // } )  
    // res.json(
    //   {
    //     status: "ok", 
        // role: user.role
      // }
  //   );
  // }
  // );

// Logout route
app.get("/logout",(req, res)=>{
  res.cookie("jwt", "", {maxAge: 1}),
  res.json({
    status: "ok",
    message: "User loged out"
  })
})
// admin or student get route
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

// admin post route
app.post("/admin", (req, res)=>{
  const {a, b, c, d} = req.body
  const newQuestion = new question({
    question: req.body.question,
    options:[
      {
        _id: "o1",
        option: a,
        isCorrect: true,
      }, 
      {
        _id: "o2",
        option: b,
        isCorrect: false
      },
      {
        _id: "o3",
        option:c,
        isCorrect: false
      },
      {
        _id: "o4",
        option: d,
        isCorrect:false
      }
    ]
  })
  // Saving questions to db
  newQuestion.save()
  .then(result =>{
    console.log(result);
    res.json({
      status: "ok",
      message: "question succesfully updated"
    })})
    .catch(err =>  console.log(err))
  })

// Student get route
app.get("/student", async (req,res)=>{
  const result =await question.find()
  res.json({
    status:"ok",
    data: result
  })
}) 

// Student post route
app.post("/student", async(req, res) => {
  let correctOptions = []
  for (let i = 0; i < req.body.answers.length; i++) {
    const {questionId, optionsId } = req.body.answers[i]
    const questionsData = await question.findById(questionId)
    findingCorrectAnswers(questionsData, optionsId,correctOptions)
  }
  res.json({
    status: "ok",
    message: correctOptions
  })
})

// finding correct answers for student route 
function findingCorrectAnswers(questionsData, optionsId,correctOptions){
  let correctOption = questionsData.options.filter(value=> value._id===optionsId)[0];
    if(correctOption.isCorrect){
      correctOptions.push(1)
    }
    else{
      correctOptions.push(0)
    }

}

app.listen(
  PORT,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
