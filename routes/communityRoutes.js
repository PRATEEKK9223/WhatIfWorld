import express from 'express';
const router= express.Router();
import Community from "../Models/community.js";
import asyncWrap from "../utils/asyncWrap.js";



router.post("/submit-result",asyncWrap(async(req,res)=>{
    const { resultId, action } = req.body;
   if(action === 'yes'){
       // avoid duplicate shares for the same result
       const existing = await Community.findOne({ result: resultId });
       if (!existing) {
         const newPost = new Community({ result: resultId });
        //  Setting the author field
         newPost.author=req.user._id;
         let post=await newPost.save();
       }
       // fetch all community posts with populated results to render
       const posts = await Community.find({}).sort({ sharedAt: -1 }).populate('result').populate('author');
       return res.render('./Components/community', { title:"community-WhatIfWorld",posts });
   }else{
    res.render(`./Components/scenario`,{title:"What-If Scenario Prediction"});
   }
}));


router.get("/community",asyncWrap(async(req,res)=>{
    const posts = await Community.find({}).sort({ sharedAt: -1 }).populate('result').populate('author');
    //  console.log(posts);
    res.render("./Components/community",{title:"community-WhatIfWorld",posts});   
}));


export default router;