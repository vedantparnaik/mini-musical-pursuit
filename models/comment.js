var mongoose = require("mongoose");

// Schema for comments
var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

// compile into model and export
module.exports = mongoose.model("Comment", commentSchema);