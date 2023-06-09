const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
require("dotenv").config();
const { transporter } = require("../configs/nodemailer");

userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.send({ message: "User already register" });
    }
    bcrypt.hash(password, 3, async (err, encrypted) => {
      if (err) {
        return res.send({ message: "Getting some error while registering" });
      }
      const user = new UserModel({
        username,
        email,
        password: encrypted,
      });
      await user.save();
      let info = await transporter.sendMail({
        from: "cristobal.kertzmann@ethereal.email", // sender address
        to: email, // list of receivers
        subject: "Email verification for Bolo Chat App", // Subject line
        text: `Hey user please click on link to verify:- https://sss-oz95.onrender.com/user/verify/${user._id}`, // plain text body
        html: "Thanks for being here", // html body
      });
      res.send({ message: "Link send to email id" });
    });
  } catch (error) {
    res.send({ message: error });
  }
  //
});

userRouter.get("/verify/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findOne({ _id: id });
    user.isVerified = true;
    await user.save();
    res.send({ message: "User verified successfully" });
  } catch (error) {
    res.send({ message: "Something went wrong while verifying" });
  }
});
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user.isVerified == false) {
      return res.send({ message: "Please do user verification" });
    }
    const hashed = user?.password;
    bcrypt.compare(password, hashed, async (err, result) => {
      if (err) {
        res.send("Wrong Credentials");
      } else if (result) {
        const token = jwt.sign({ userId: user._id }, "secret");
        res.send({ message: "Logged in successfully", token });
      }
    });
  } catch (error) {
    res.send({ message: "Something went wrong while login" });
  }
});
module.exports = { userRouter };
