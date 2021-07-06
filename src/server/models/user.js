const mongoose = require("mongoose");
let crypto = require("crypto");

let makeSalt = () => {
    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

let encryptPassword = (salt, password) => {
    return crypto.createHmac("sha512", salt).update(password).digest("hex");
}

const User = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: {type: String, required: true},
    handle: {type: String, required: true},
    email: {type: String, required: true},
    hash: {type: String, required: true},
    salt: {type: String, required: true}
});

User.virtual("password").set(function(password) {
    this.salt = makeSalt();
    this.hash = encryptPassword(this.salt, password);
});

User.method("authenticate", function(plainText) {
    console.log("authenticating");
    return encryptPassword(this.salt, plainText) === this.hash;
});

module.exports = mongoose.model("User", User);
