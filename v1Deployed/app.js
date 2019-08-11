const mongoose = require("mongoose"),
      express = require("express"),
      app = express(),
      flash = require("connect-flash"),
      bodyParser = require("body-parser"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      seedDB = require("./seeds"),
      passport = require("passport"),
      localStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      User = require("./models/user");
      
const campgroundRoutes  = require("./routes/campgrounds"),
      commentRoutes    = require("./routes/comments"),
      indexRoutes       = require("./routes/index");




//seedDB(); //seed the database
app.set("view engine", "ejs");
mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
    secret: "Once again rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server Started!!");
});
