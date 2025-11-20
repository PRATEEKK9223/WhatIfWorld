import Joi from "joi";

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters"
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Enter a valid email address",
    "string.empty": "Email is required"
  }),

  password: Joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")).messages({
    "string.pattern.base":
    "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character (@$!%*?&).",
    "string.empty": "Password cannot be empty"
  }),
});


const signUpSchemaValidation =(req,res,next)=>{
    const {error}=signupSchema.validate(req.body,{abortEarly:false});
    console.log(error);
    if(error){
        const errorMessages=error.details.map(detail=>detail.message);
        console.log(errorMessages);
        // return res.status(400).render("./Error/error",{message: errorMessages.join(", ")});
        req.flash("error",errorMessages);
        return res.redirect("/signUp");
    }
    next();  
}

export {signUpSchemaValidation};
