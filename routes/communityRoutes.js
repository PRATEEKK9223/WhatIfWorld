import express from 'express';
const router= express.Router();
import Community from "../Models/community.js";
import asyncWrap from "../utils/asyncWrap.js";
import {isLoggedIn} from "../utils/middlewares.js";



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
       req.flash("success","Your prediction has been shared in Community");
       return res.redirect('/community');
   }else{
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect(`/scenario`);
   }
}));


router.get("/community",asyncWrap(async(req,res)=>{
    const posts = await Community.find({}).sort({ sharedAt: -1 }).populate('result').populate('author');
    res.render("./Components/community",{title:"community-WhatIfWorld",posts,activePage: "community"});   
}));


router.get("/delete/:id",isLoggedIn,asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let post =await Community.findById(id);
    if(!post){
        return res.status(404).json("post not Found");
    }
    if(post.author.equals(req.user._id)){
        await Community.findByIdAndDelete(id);
        req.flash("success","Your Post Deleted Successfully");
        res.redirect("/community");
    }else{
        req.flash("info","Your Not a Author to Delete");
        res.redirect("/community");
    }
}));


export default router;