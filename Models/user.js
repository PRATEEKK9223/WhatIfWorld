
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
        default:"/images/profile.jpg"   
    },
    bio:{
        type:String,
        defult:"",
        Maxlength:250
    },
    dateOfBirth:{
        type:Date,
    }

});

UserSchema.plugin(passportLocalMongoose , { usernameField: "email" ,  usernameUnique: false});

const User=mongoose.model("User",UserSchema);

export default User;