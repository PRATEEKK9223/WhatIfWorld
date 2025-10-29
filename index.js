// importing modules

import express from "express";
const app=express();
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
// import Cerebras from '@cerebras/cerebras_cloud_sdk';
// import Result from "./Models/result.js";
// import Community from "./Models/community.js";
import multer from 'multer';
// import cloudinary from "./cloudinary-script.js";
// import { v2 as cloudinaryV2 } from 'cloudinary';
const upload = multer({ storage: multer.memoryStorage() });

// import asyncWrap from "./utils/asyncWrap.js";
import customError from "./utils/customError.js";

// importing the routes
import requestRoutes from "./routes/requestsRoutes.js";
import cloudinaryRoutes from "./routes/cloudinaryRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";


// posport for authentication
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./Models/user.js" ;

app.use(session({
  secret: 'valgar',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}));

// ---------------------------PASSPORT CONFIGURATION-----------------
// Initialize passport and session support
app.use(passport.initialize());
app.use(passport.session());

// Configure passport to use local strategy with User model
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize user for session persistence
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// middlewares
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());



// to connect with database
mongoose.connect(process.env.MONGO_URL).then(res=>{
    console.log("DB connected successfully");
}).catch(err=>{
    console.log("DB not connected");
    console.log(err);
});



// cerebras clint routes
app.use("/",requestRoutes);

// cloudinary routes
app.use("/",cloudinaryRoutes);

// community routes
app.use("/",communityRoutes);


// ---------------------------AUTHENTICATION ROUTES--------------------

app.get("/signUp",(req,res)=>{
    res.render("Authentication/signUp");
});

app.post("/signUp",async (req,res)=>{
    try{
      const {username,email,password}=req.body;
      const user=new User({username,email});
      let RegisteredUser=await User.register(user,password);
      req.login(RegisteredUser,(err)=>{
        if(err){
          console.log(err);
          res.send("Some error occurred during login after sign up.");
        }else{
           res.redirect("/scenario");
        }
      })

    }catch(err){
      console.log(err);
       res.send("Some error occurred during sign up.",err);
    }  
});

app.get("/login",(req,res)=>{
    res.render("Authentication/login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/scenario",
    failureRedirect:"/login"
}));

app.get("/logout",(req,res)=>{
   req.logout((err)=>{
    if(err){
        console.log(err);
        res.send("Some error occurred during logout.");
    }else{
        res.redirect("/login");
    }
   })
});


// Catch-all for invalid routes (404)
app.use((req, res, next) => {
    next(new customError(404, "Page Not Found"));
});

// globle Error handling middleware
app.use((err,req,res,next)=>{
  console.log(err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if(status===404){
    return res.status(404).render("./Error/404",{err});
  }else{
    res.status(status).json({
    success: false,
    message
    });
  } 
});






// to start the server
app.listen(3000,()=>{
    console.log("server starts at 3000");
});