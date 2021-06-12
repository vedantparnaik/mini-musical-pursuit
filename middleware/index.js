var middlewareObj = {};
var Music = require("../models/music");
var Comment = require("../models/comment");

middlewareObj.checkMusicOwnership = function(req, res, next){
    // check if user is logged in
    if(req.isAuthenticated()){
        Music.findById(req.params.id, function(err, foundMusic){
            if(err){
                req.flash("error", "Error: Entry not found.");
                res.redirect("back");
            } else {
                // does the user own the current music entry
                if(foundMusic.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Oops, you don't have permission to do that.");
                    res.redirect("back");
                }
            } 
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    // check if user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Error: Comment not found.");
                res.redirect("back");
            } else {
                // does the user own the current comment entry
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Oops, you don't have permission to do that.");
                    res.redirect("back");
                }
            } 
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};


module.exports = middlewareObj;