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
         let post=await newPost.save();
       }
       // fetch all community posts with populated results to render
       const posts = await Community.find({}).sort({ sharedAt: -1 }).populate('result');
       return res.render('./Components/community', { posts });
   }else{
    res.render(`./Components/scenario`);
   }
}));


router.get("/community",asyncWrap(async(req,res)=>{
    const posts = await Community.find({}).sort({ sharedAt: -1 }).populate('result');
    res.render("./Components/community",{posts});   
}));
export default router;