import express from 'express';
const router= express.Router();
import Community from "../Models/community.js";
import asyncWrap from "../utils/asyncWrap.js";
import {isLoggedIn} from "../utils/middlewares.js";
import {isLoggedInAjax} from "../utils/middlewares.js";
import {calculateTrendingScore} from "../utils/trendingScore.js"



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
        // req.flash("error", "Something went wrong. Please try again.");
        return res.redirect(`/scenario`);
   }
}));


router.get("/community",asyncWrap(async(req,res)=>{
    const posts = await Community.find({}).sort({ sharedAt: -1 }).populate('result').populate('author').populate('comments.author', 'username photo'); ;
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

// Like the post route
router.post("/community/like/:id",isLoggedInAjax,asyncWrap(async(req,res)=>{
    let {id}=req.params;
    const post=await Community.findById(id);
    if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
    }
    // Convert ObjectIds to strings before comparing
    const userId = req.user._id.toString();
    const index = post.likes.findIndex(like => like.toString() === userId);
    let isLiked;
    if(index === -1){
        post.likes.push(req.user._id);
        isLiked=true;
    }else{
        post.likes.splice(index,1);
        isLiked=false;
    }
    post.trendingScore=calculateTrendingScore(post);
    await post.save();
    // Sending the data to the frontend
    res.json({success: true,isLiked,likeCount: post.likes.length});
}));


// comment 

router.post("/community/comment/:id",isLoggedInAjax,asyncWrap(async(req,res)=>{
    const {id}=req.params;
    const {text}=req.body;
    const post=await Community.findById(id);
    if(!post){
        res.status(400).json({success:false,message:"Post not found"});
    }
    if(!text || !text.trim()){
        res.status(400).json({success:false,message:"Coment can not be empty"});
    }

    const comment={
        text:text,
        author:req.user._id,
        createdAt:Date.now(),
    }
    // post.comments.push(comment);
    post.comments.unshift(comment);
     post.trendingScore=calculateTrendingScore(post);
    await post.save();
    await post.populate("comments.author","username photo");


    const newComment = post.comments[0];
    // const newComment=post.comments[post.comments.length-1];
    // this is to send the data instantly using Ajax without page reload
    res.json({
        success:true,
        comment:{
            id:newComment._id,
            text:newComment.text,
            author:{
                username:newComment.author.username,
                photo:newComment.author.photo,
            },
            createdAt:newComment.createdAt,
        }
    });

}));


// Comment delete route

router.delete("/community/comment/:postId/:commentId", isLoggedIn, asyncWrap(async (req, res) => {
  const { postId, commentId } = req.params;
  const community = await Community.findById(postId).populate("comments.author");

  const comment = community.comments.id(commentId);
  if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

  // Only author or admin can delete
  if (comment.author._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  comment.deleteOne(); // remove the comment
  await community.save();

  res.json({ success: true, commentId });
}));


// full post details  

router.get("/community/:id", asyncWrap(async(req,res)=>{
    const post = await Community.findById(req.params.id)
      .populate("result")
      .populate("author")
      .populate("comments.author");

    if(!post){
        req.flash("error","Post not found");
        return res.redirect("/community");
    }

    res.render("./Components/postDetails",{title:"Post Details",post});
}));


// view increment Route

router.post("/community/view/:id", async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false });

    // Get Client IP
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // If same IP already viewed → do NOT count
    if (!post.viewedIPs.includes(ip)) {
      post.views += 1;
      post.viewedIPs.push(ip);
      post.trendingScore=calculateTrendingScore(post);
      await post.save();
    }

    res.json({ success: true, views: post.views });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

export default router;