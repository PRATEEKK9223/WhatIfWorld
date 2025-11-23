import express from 'express';
const router= express.Router();


router.get("/faqs",(req,res)=>{
    res.render("./footer-links/FAQs", {title: "FAQs - WhatIfWorld",activePage: "FAQs"});
});


router.get("/privacy",(req,res)=>{
    res.render("./footer-links/privacy-policy", {title: "privacy-policy - WhatIfWorld",activePage: "privacy-policy"});
});

router.get("/terms",(req,res)=>{
    res.render("./footer-links/terms-conditions", {title: "terms-conditions - WhatIfWorld",activePage: "terms-conditions"});
});

router.get("/services",(req,res)=>{
    res.render("./footer-links/services", {title: "services - WhatIfWorld",activePage: "services"});
});

router.get("/document",(req,res)=>{
    res.render("./footer-links/document", {title: "Document - WhatIfWorld",activePage: "document"});
});



export default router;