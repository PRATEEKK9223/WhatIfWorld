

const isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        // Only save redirect URL for GET requests
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        }
        req.flash("info","You must be logged in first");
        return res.redirect("/login");
    }
    next();
}

// this middleware to store the session redirectUrl data in the locals variable to access
const saveRedirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
};

const isLoggedInAjax = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Instead of redirecting, send JSON so the frontend can handle it
     req.flash("info","You must be logged in first");
    return res.status(401).json({ redirectUrl: "/login" });
  }
  next();
};

export {isLoggedIn,saveRedirectUrl,isLoggedInAjax};