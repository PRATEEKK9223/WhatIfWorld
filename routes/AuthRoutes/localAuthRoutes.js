import express from "express";
const router =express.Router();
import passport from "passport";
import User from "../../Models/user.js";
import asyncWrap from "../../utils/asyncWrap.js";
import {signUpSchemaValidation} from "../../utils/joiValidation.js";
import {saveRedirectUrl} from "../../utils/middlewares.js";


router.get("/signUp",(req,res)=>{
    res.render("Authentication/signUp",{title:"Sign Up | WhatIfWorld"});
});

router.post("/signUp",signUpSchemaValidation,async (req,res)=>{
    try{
        const {username,email,password}=req.body;
        const user=new User({username,email});
        let RegisteredUser=await User.register(user,password);
        req.login(RegisteredUser,(err)=>{
            if(err){
                console.log(err);
                req.flash("error", "Something went wrong during login. Please try again.");
                return res.redirect("/signUp");
            }else{
                req.flash("success","Welcome to WhatIfWorld ",username);
                return res.redirect("/");
            }
        });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signUp");
    }
});  


router.get("/login",(req,res)=>{
    res.render("Authentication/login",{title:"Login | WhatIfWorld"});
});

router.post("/login",saveRedirectUrl,passport.authenticate("local",{ failureRedirect: '/login', failureFlash: "Invalid userEmail or password!",}),(req,res)=>{
    req.flash("success","Wellcome To WhatIfWorld");
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/");
    }   
});

router.get("/logout",(req,res)=>{
   req.logout((err)=>{
    if(err){
        console.log(err);
        next(err);
    }else{
        req.flash("success", "You have been logged out successfully.");
        res.redirect("/");
    }
   })
});

export default router;