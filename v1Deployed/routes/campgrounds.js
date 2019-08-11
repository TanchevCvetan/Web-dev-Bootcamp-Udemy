const express =require("express"),
      Campground = require("../models/campground"),
      middleware = require("../middleware");
      
const router = express.Router();




//Show Campgrounds
router.get("/",function(req, res){
    Campground.find({},function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds/index",{campgrounds:campgrounds,});
        }
    });
});

//Add a new campground
router.post("/", middleware.isLoggedIn , function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    Campground.create(newCampground,function(err, newCampground){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new",middleware.isLoggedIn,function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id",function(req, res){
     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            return res.redirect('/campgrounds');
        }
        console.log(foundCampground);
        //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership , (req, res)=>{
    Campground.findById(req.params.id,(err, campground)=>{
        res.render("campgrounds/edit",{campground: campground});
    });
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership ,(req, res)=>{
    Campground.findOneAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership ,(req, res)=>{
    Campground.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;
