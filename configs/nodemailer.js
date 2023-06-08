const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "cristobal.kertzmann@ethereal.email",
    pass: "gVfaHkE5k8uNBdfn4m",
  },
});

module.exports = { transporter };
