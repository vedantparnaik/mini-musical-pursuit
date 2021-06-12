var express    = require("express");
var router     = express.Router();
var Music      = require("../models/music");
var Comment    = require("../models/comment");

// require middle ware
var middleware = require("../middleware/index.js");

// show new comment form
router.get("/music/:id/comments/new", middleware.isLoggedIn, function(req, res){
    //find music by id
    Music.findById(req.params.id, function(err, music){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {music: music});
        }
    });
});

// create new comment
router.post("/music/:id/comments", middleware.isLoggedIn, function(req, res){
    //look up music using id
    Music.findById(req.params.id, function(err, music){
        if(err){
            req.flash("error", "Error: Comment cannot be created. Please try again.");
            console.log(err);
            res.redirect("/music");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    //connect new comment to music entry
                    music.comments.push(comment);
                    music.save();
                    //rediret to show page
                    req.flash("success", "Successfully created comment.");
                    res.redirect("/music/" + music._id);
                }
            });
        }
    });
});

// EDIT route - show edit comment page
router.get("/music/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {music_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE route - handles logic for updating comment
router.put("/music/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Successfully updated comment.");
            res.redirect("/music/" + req.params.id);
        }
    });
});

// DESTROY route - delete a comment
router.delete("/music/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   // find by id and remove
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back");
      } else {
           req.flash("success", "Successfully deleted comment.");
           res.redirect("/music/" + req.params.id);
      }
   });
});

module.exports = router;