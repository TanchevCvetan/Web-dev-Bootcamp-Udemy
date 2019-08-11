const express   =require("express"),
      passport = require("passport"),
      User      = require("../models/user");
const router = express.Router();



router.get("/", function(req, res){
    res.render("landing");
});


//show register for
router.get("/register",(req,res)=>{
    res.render("register");
});

// handles sign up logic

router.post("/register",(req,res)=>{
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,(err, user)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res,()=>{
            req.flash("success", "Wellcome to yelpcamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login",(req, res)=>{
    res.render("login");
});

//handles login logic

router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/register"
}),(req, res)=>{
    
});

//logout route
router.get("/logout",(req, res)=>{
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
});


module.exports = router;
