const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "toney18@ethereal.email",
    pass: "mAM182yGXEjNHZDAWf",
  },
});

module.exports = { transporter };
