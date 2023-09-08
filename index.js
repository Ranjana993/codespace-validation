const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./model/userModel");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
require("dotenv").config();
require("./dbConfig/db").connect();

const { PORT } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("working...");
});

// register
app.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!(firstname && lastname && email && password)) {
    res.status(400).json({ message: "Plz fill all the inputs " });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(401).json({ message: "User already exist " });
  }
  const myEncPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstname,
    lastname,
    email,
    password: myEncPassword,
  });

  const token = jwt.sign({ id: newUser._id }, "shhhh", {
    expiresIn: "2h",
  });

  newUser.token = token;
  newUser.password = undefined;
  res.status(200).json({ message: "successfully registered user", newUser });
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.json(400).json({ message: "plz fill all inputs" });
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, "shhhh", {
      expiresIn: "2h",
    });
    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res
      .status(200)
      .cookie("token", token, options)
      .json({ message: "successfully signed ", token, user });
  }
});

app.get("/dashboard" ,auth, (req,res) =>{
  // console.log(req.user);
  res.send("Welcome to dashboard. ")
})

app.get("/settings" ,auth ,  (req,res) =>{

  res.send("Welcome to Settings . ")
})


app.listen(PORT, () => console.log("App is running "));
