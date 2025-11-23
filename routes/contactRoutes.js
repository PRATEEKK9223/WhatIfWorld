
import express from 'express';
const router = express.Router();
import nodemailer from 'nodemailer';
import {isLoggedIn} from "../utils/middlewares.js";


router.get("/contact",(req,res)=>{
    res.render("./footer-links/contactUs", {title: "contactUs - WhatIfWorld",activePage: "contactUs"});
});


// Gmail Transporter (use your Gmail + App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email,       
    pass: process.env.AppPassword,     
  },
});


// POST route to send message
router.post("/contact",isLoggedIn, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    req.flash("error", "All fields are required.");
    return res.redirect("/contact");
    
  }

  try {
    await transporter.sendMail({
      from: email,
      to: "whatifworldpulse4@gmail.com",
      subject: `New Contact Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}

        Message:
        ${message}
      `,
    });

    req.flash("success", "Message sent successfully!");
    res.redirect("/contact");

  } catch (err) {
    console.error("Error sending email:", err);
    req.flash("error", "Failed to send message. Please try again later.");
    res.redirect("/contact");
  }
});

export default router;
