import express from 'express';
const router= express.Router();

router.get("/about", (req, res) => {
  res.render("./Components/aboutUs", {title: "About - WhatIfWorld",activePage: "about"});
});


export default router;