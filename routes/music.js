var express = require("express");
var router = express.Router();
var Music = require("../models/music");

// require middle ware
var middleware = require("../middleware/index.js");

// INDEX route - displays  all music
router.get("/music", function(req, res){
    
    // get all music from db 
    Music.find({}, function(err, allMusic){
        if(err){
            console.log(err);
        } else { // render music
            res.render("music/index", {music: allMusic});
        }
    });
});

// CREATE route - create new music and add to db
router.post("/music", middleware.isLoggedIn, function(req, res){
   // get data from request form and add to db
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   
   // make new object for music to push to db
   var newMusic = {name: name, image: image, description: desc, author: author};
   
   // create a new music entry and save to database
   Music.create(newMusic, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
            //redirect back to music page - this will ridirect to GET /music route
            res.redirect("/music");
       }
   });
});

// NEW route - route to show submit form for new music entry
router.get("/music/new", middleware.isLoggedIn, function(req, res){
   res.render("music/new"); 
});

// SHOW route - route that shows more information on specific music entry
router.get("/music/:id", function(req, res){
    // find the music with the provided ID
    Music.findById(req.params.id).populate("comments").exec(function(err, foundMusic){
        if(err){
            console.log(err);
        } else {
            // render show template with that music entry
            res.render("music/show", {music: foundMusic});
        }
    });
});

// EDIT route - shows form to update a music entry
router.get("/music/:id/edit", middleware.checkMusicOwnership, function(req, res){
        Music.findById(req.params.id, function(err, foundMusic){
            res.render("music/edit", {music: foundMusic});
        });
});

// UPDATE route - handles logic for updating an existing music entry
router.put("/music/:id", middleware.checkMusicOwnership, function(req, res){
   Music.findByIdAndUpdate(req.params.id, req.body.music, function(err, updatedMusic){
       if(err){
           res.redirect("/music");
       } else {
            req.flash("success", "Successfully updated entry.");
            res.redirect("/music/" + req.params.id);
       }
   }); 
});

// DESTROY route
router.delete("/music/:id", middleware.checkMusicOwnership, function (req,res){
   Music.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/music");
      } else {
          req.flash("success", "Successfully deleted music entry.");
          res.redirect("/music");
      }
   });
});

module.exports = router;