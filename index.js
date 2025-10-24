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
import multer from 'multer';
import cloudinary from "./cloudinary-script.js";
import { v2 as cloudinaryV2 } from 'cloudinary';

const upload = multer({ storage: multer.memoryStorage() });

console.log(process.env.CLOUDINARY_API_KEY, "in app.js");



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
    res.render("scenario");
});

app.post("/scenario",async(req,res)=>{
    let scenario=req.body.scenario;
    let domain=req.body.domain;
    // console.log(req.body);
    try{
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
    console.log(result);
    // save result to database
    const newResult=new Result(result);
    await newResult.save().then(res=>{
        console.log("Result saved to DB",res);
    }).catch(err=>{
        console.log("Error saving result to DB",err);
    });

    res.render("result", { result});
}catch(err){
    console.log(err);
    res.send("Some error occurred");
}
});





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

     // ✅ Update the same document with image URLs
    // await Result.findByIdAndUpdate(resultId, {
    //   $set: {
    //     chartImages: {
    //       barChart: barUpload.secure_url,
    //       pieChart: pieUpload.secure_url
    //     }
    //   }
    //   });

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




