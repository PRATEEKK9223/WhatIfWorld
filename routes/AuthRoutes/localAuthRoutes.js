import express from "express";
const router =express.Router();
import passport from "passport";
import User from "../../Models/user.js";
import asyncWrap from "../../utils/asyncWrap.js";


router.get("/signUp",(req,res)=>{
    res.render("Authentication/signUp");
});

router.post("/signUp",asyncWrap(async (req,res)=>{
      const {username,email,password}=req.body;
      const user=new User({username,email});
      let RegisteredUser=await User.register(user,password);
      req.login(RegisteredUser,(err)=>{
        if(err){
          console.log(err);
            next(err);
        }else{
           res.redirect("/scenario");
        }
      });
}));

router.get("/login",(req,res)=>{
    res.render("Authentication/login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/scenario",
    failureRedirect:"/login"
}));

router.get("/logout",(req,res)=>{
   req.logout((err)=>{
    if(err){
        console.log(err);
        next(err);
    }else{
        res.redirect("/login");
    }
   })
});

export default router;