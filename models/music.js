var mongoose = require("mongoose");

// set up mongoose Schema design for music
var musicSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }   
   ]
});

// compile into model and export
module.exports = mongoose.model("Music", musicSchema);
