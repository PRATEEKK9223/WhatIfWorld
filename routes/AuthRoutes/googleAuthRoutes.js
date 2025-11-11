import express from 'express';
const router= express.Router();
import passport from "passport";


router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
    passport.authenticate("google", { 
        failureRedirect: "/login", failureFlash: "Google authentication failed. Please try again!"
    }),
    (req, res) => {
        req.flash("success","WellCome To WhatIFWorld")
        res.redirect("/"); // login success
    }
);

export default router;



