// importing modules

import express from "express";
const app=express();
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

import flash from "connect-flash";
import ejsMate from "ejs-mate";
app.engine("ejs",ejsMate);


import customError from "./utils/customError.js";

// importing the routers
import requestRoutes from "./routes/requestsRoutes.js";
import cloudinaryRoutes from "./routes/cloudinaryRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import localAuthRoutes from "./routes/AuthRoutes/localAuthRoutes.js";
import googleAuthRoutes from "./routes/AuthRoutes/googleAuthRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";


// posport for authentication
import session from "express-session";
import MongoStore from "connect-mongo"
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./Models/user.js" ;
import "./googleCloudConfig.js";


const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Session Store Error");
});

// required for HTTPS cookies in deployment
app.set("trust proxy", 1);

app.use(session({
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 600000,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }
}));

// enabling the flash messages
app.use(flash());

// ---------------------------PASSPORT CONFIGURATION-----------------
// Initialize passport and session support
app.use(passport.initialize());
app.use(passport.session());

// Configure passport to use local strategy with User model
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());

// Serialize and deserialize user for session persistence
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user, done) => {
  done(null, user.id); // ✅ Store only user._id in session
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user); // ✅ Load fresh user from DB
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// middlewares
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));



// to connect with database
mongoose.connect(process.env.MONGO_URL).then(res=>{
    console.log("DB connected successfully");
}).catch(err=>{
    console.log("DB not connected");
    console.log(err);
});


// ------middleware for local storage of flash messages------

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.info=req.flash("info");
    res.locals.currentUser=req.user;
    next();
});


// cerebras clint routes
app.use("/",requestRoutes);

// cloudinary routes
app.use("/",cloudinaryRoutes);

// community routes
app.use("/",communityRoutes);

// ---------------------------AUTHENTICATION ROUTES--------------------
app.use("/",localAuthRoutes);

app.use("/",googleAuthRoutes);

app.use("/",profileRoutes);

app.use("/",aboutRoutes);

// home route
app.get("/",(req,res)=>{
    res.render("./Components/home",{title: "Home - WhatIfWorld",activePage: "home"});
});


// app.get("/profile",(req,res)=>{
//     res.render("Authentication/profile",{title: "Profile - WhatIfWorld"});
// });

app.get("/edit-profile",(req,res)=>{
    res.render("Authentication/editProfile",{title: "Edit Profile - WhatIfWorld"});
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

const PORT = process.env.PORT || 3000;
// to start the server
app.listen(PORT,()=>{
    console.log("server starts at ",PORT);
});