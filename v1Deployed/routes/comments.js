
const express       =require("express"),
      Campground    = require("../models/campground"),
      middleware    =require("../middleware"),
      Comment       =require("../models/comment");
      

const router = express.Router({mergeParams: true});


router.get("/new",middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id,(err, campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", middleware.isLoggedIn , (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    console.log(err);
                }else{
                    //add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","succesfully added comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, middleware.isLoggedIn ,(req, res)=>{
    Comment.findById(req.params.comment_id,(err, comment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id: req.params.id, comment: comment});
        }
    });
});
//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership ,(req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,(err, updatedcomment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});
//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership ,(req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id,(err)=>{
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "comment deleted");
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});



module.exports = router;