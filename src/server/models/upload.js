const mongoose = require("mongoose");

const uploadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    handle: {type: String, default: ""},
    content: {type: String, default: ""},
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
    inappropriate: {type: Number, default: 0}
});

module.exports = mongoose.model("Upload", uploadSchema);
