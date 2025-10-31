
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";


const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true
    },
    username:{
        type:String,
    },
    photo:{
        type:String,    
    }
});

UserSchema.plugin(passportLocalMongoose);

const User=mongoose.model("User",UserSchema);

export default User;