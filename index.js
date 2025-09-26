// importing modules
const express=require("express");
const app=express();
const path=require("path");
require("dotenv").config();
const mongoose=require("mongoose");


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


app.get("/manish",(req,res)=>{
    res.render("home.ejs");
});