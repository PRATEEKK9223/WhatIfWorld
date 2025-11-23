
import express from 'express';
const router = express.Router();
import { Resend } from "resend";
import {isLoggedIn} from "../utils/middlewares.js";


router.get("/contact",(req,res)=>{
    res.render("./footer-links/contactUs", {title: "contactUs - WhatIfWorld",activePage: "contactUs"});
});


const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/contact", isLoggedIn, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    req.flash("error", "All fields are required.");
    return res.redirect("/contact");
  }

  try {
    await resend.emails.send({
      from: "WhatIfWorld <onboarding@resend.dev>",
      to: "whatifworldpulse4@gmail.com",
      subject: `Contact Message from ${name}`,
      text: `
            Name: ${name}
            Email: ${email}

            Message:
            ${message}
      `,
    });

    req.flash("success", "Message sent successfully!");
    res.redirect("/contact");
  } catch (error) {
    console.error("Error sending email:", error);
    req.flash("error", "Failed to send message.");
    res.redirect("/contact");
  }
});

export default router;
