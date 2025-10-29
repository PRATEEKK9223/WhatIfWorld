import express from 'express';
const router= express.Router();
import Community from "../Models/community.js";


router.post("/submit-result",async(req,res)=>{
    const { resultId, action } = req.body;
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

export default router;