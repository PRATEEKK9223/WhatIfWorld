import express from 'express';
const router= express.Router();
import passport from "passport";


router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
    passport.authenticate("google", { 
        failureRedirect: "/login"
    }),
    (req, res) => {
        res.redirect("/scenario"); // login success
    }
);

export default router;



