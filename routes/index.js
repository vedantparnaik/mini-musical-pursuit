var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// show the register form
router.get("/register", function(req, res){
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    var password = req.body.password;
    
    User.register(newUser, password, function(err, user){
       if(err){
           req.flash("error", err.message);
           console.log(err);
           return res.render("register");
       } 
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to MusicalPursuit, " + user.username);
           res.redirect("/music");
       });
    });
});

// show the login form
router.get("/login", function(req, res){
    res.render("login");
});

// handle the login logic, using passport middleware
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/music",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout(); //from passport
    req.flash("success", "You have been logged out.");
    res.redirect("/music");
});

module.exports = router;