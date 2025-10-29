// importing modules

import express from "express";
const app=express();
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import Result from "./Models/result.js";
import Community from "./Models/community.js";
import multer from 'multer';
import cloudinary from "./cloudinary-script.js";
import { v2 as cloudinaryV2 } from 'cloudinary';
const upload = multer({ storage: multer.memoryStorage() });

import asyncWrap from "./utils/asyncWrap.js";
import customError from "./utils/customError.js";


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

// to start the server
app.listen(3000,()=>{
    console.log("server starts at 3000");
});


app.get("/scenario",(req,res)=>{
    res.render("./Components/scenario");
});

app.post("/scenario",asyncWrap(async(req,res)=>{
    let scenario=req.body.scenario;
    let domain=req.body.domain;
    // console.log(req.body);
    // try{
     const client = new Cerebras({
        apiKey: process.env.CEREBRAS_API_KEY, // This is the default and can be omitted
      });

    const completion = await client.chat.completions.create({
            messages: [
                    {
                      role: "system",
                      content: `
                      You are an AI future scenario predictor.
                      Given a "What if" scenario and its domain, respond strictly in the following JSON structure:

                    { 
                      "textual_analysis": {
                        "scenario": "string",
                        "domain": "string",
                        "probability": number,
                        "key_implications": ["string", "string", ...],
                        "potential_challenges": ["string", "string", ...]
                      },
                      "statistics": {
                        "Metric1": number,
                        "Metric2": number,
                        "Metric3": number,
                        "Metric4": number
                      }
                    }

                    The response should change dynamically based on the domain provided.
                    Use domain-specific metrics. Example domains include:
                    - Environment → CO2 Reduction, Job Creation, Cost Reduction, Efficiency Gain
                    - Health → Life Expectancy, Recovery Rate, Healthcare Cost Reduction, Innovation Index
                    - Education → Literacy Rate, Student Engagement, Digital Access, Teaching Quality
                    - Technology → Innovation Rate, Adoption Level, Automation Impact, Cyber Risk
                    - Economy → GDP Growth, Employment Rate, Inflation Stability, Market Confidence
                    - Society → Social Welfare, Equality Index, Safety Level, Cultural Growth
                    - Politics → Stability Score, Policy Impact, Voter Engagement, International Relations
                    `
              },
              {
                role: "user",
                content: `Scenario: ${scenario}\nDomain: ${domain}`
            }
          ],
          model: "llama-4-scout-17b-16e-instruct",
          response_format: { type: "json_object" }
});

    const result = JSON.parse(completion.choices[0].message.content);
    result.textual_analysis.probability*=100;  
  
  // persist result and then render the result page with the saved document id
  const newResult = new Result(result);
  await newResult.save();
  // console.log('Result saved to DB:', newResult._id);
  res.render("./Components/result", { result, resultId: newResult._id });
// }catch(err){
    // console.log(err);
    // res.send("Some error occurred");
// }
}));




app.post('/upload-chart', upload.fields([{ name: 'barChart' }, { name: 'pieChart' }]), async (req, res) => {
  try {
    const bar = req.files['barChart'][0];
    const pie = req.files['pieChart'][0];

    const uploadToCloudinary = (fileBuffer, fileName) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinaryV2.uploader.upload_stream(
          { folder: 'WhatIfWorld-Charts', public_id: fileName, resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(fileBuffer); // ✅ send the image data
      });
    };

    const [barUpload, pieUpload] = await Promise.all([
      uploadToCloudinary(bar.buffer, 'barChart'),
      uploadToCloudinary(pie.buffer, 'pieChart')
    ]);

    // ✅ Read resultId from the incoming form fields and validate
    const resultId = req.body && req.body.resultId;
    if (!resultId) {
      console.error('upload-chart: missing resultId in request body');
      return res.status(400).json({ error: 'Missing resultId' });
    }

    // Update the same document with image URLs
    await Result.findByIdAndUpdate(resultId, {
      $set: {
        chartImages: {
          barChart: barUpload.secure_url,
          pieChart: pieUpload.secure_url
        }
      }
    });

    res.json({
      message: 'Charts uploaded successfully!',
      barChartUrl: barUpload.secure_url,
      pieChartUrl: pieUpload.secure_url
    });
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post("/submit-result",async(req,res)=>{
    const { resultId, action } = req.body;
    // const allPost=await Result.find({});
    // console.log("All posts:", allPost);
   if(action === 'yes'){
     try {
       // avoid duplicate shares for the same result
       const existing = await Community.findOne({ result: resultId });
       if (!existing) {
         const newPost = new Community({ result: resultId });
         let post=await newPost.save();
       }

       // fetch all community posts with populated results to render
       const posts = await Community.find({}).sort({ sharedAt: -1 }).populate('result');
       return res.render('./Components/community', { posts });
     } catch (err) {
       console.error('Error saving community post:', err);
       return res.status(500).send('Failed to save community post');
     }
   }else{
    res.render(`./Components/scenario`);
   }
});


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





