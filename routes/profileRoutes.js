import express from 'express';
const router= express.Router();
import User from "../Models/user.js" ;
import asyncWrap from "../utils/asyncWrap.js";
import {isLoggedIn} from "../utils/middlewares.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import cloudinary from "../cloudinaryConfig.js";


router.get("/profile/:id",isLoggedIn,asyncWrap(async(req,res)=>{
    const user=await User.findById(req.params.id);
    // console.log(user);
    res.render("Authentication/profile",{title: "Profile - WhatIfWorld",user});
}));

router.get("/edit-profile",isLoggedIn,asyncWrap(async(req,res)=>{
    const user=await User.findById(req.user._id);
    res.render("Authentication/editProfile",{title: "Edit Profile - WhatIfWorld",user});
}));


router.post("/edit-profile",isLoggedIn,upload.single("photo"),asyncWrap(async (req,res)=>{
    const {username,bio,dateOfBirth}=req.body;
    const user=await User.findById(req.user._id);
    user.username=username;
    user.bio=bio;
    user.dateOfBirth=dateOfBirth;
    // console.log(req.file);
     if (req.file) {
    // Upload to Cloudinary using the file buffer
            const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                    folder: "WhatIfWorld-profile",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer); // upload file buffer
    });


    // Save the Cloudinary URL to user.photo
    user.photo = result.secure_url;
  }
    await user.save();
    req.flash("success","Profile updated successfully");
    res.redirect(`/profile/${user._id}`);
}));

export default router;