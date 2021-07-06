const mongoose = require("mongoose");
const Upload = require("./models/upload");
const User = require("./models/user");

exports.validateHandle = async (req, res, next) => {
    console.log("Trying to find handle " + req.params.handle + "...");
    try {
        await User.findOne({"handle": req.params.handle}, function(err, existing) {
            if (err) {
                console.log("Error");
            } else {
                if (existing) {
                    console.log("Handle already exists");
                    res.status(409).send({error: "Error: Handle already exists"});
                } else {
                    console.log("valid Handle");
                    res.status(200).send({});
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.register = async (req, res, next) => {
    console.log("Trying to register " + req.body.handle + "...");
    try {
        let user = await new User({
            _id: new mongoose.Types.ObjectId(),
            fullName: req.body.fullName,
            email: req.body.email,
            handle: req.body.handle,
            salt: "tmp",
            hash: "tmp"
        });
        user.set('password', req.body.password);
        await user.save();
        console.log("Registered " + req.body.handle + " user to Mongo!");
        res.status(200).send({});
    } catch (err) {
        console.log(err);
    }
}

exports.login = async (req, res, next) => {
    console.log(req.body.handle + " is trying login...");
    try {
        await User.findOne({"handle": req.body.handle}, function(err, user) {
            if (err) {
                console.log("Error");
            } else {
                if (user && user.authenticate(req.body.password)){
                    let creds = {
                        name: user.fullName,
                        email: user.email,
                        handle: user.handle
                    };
                    //console.log("found!");
                    //console.log(creds);
                    res.status(201).send({creds});
                } else {
                    console.log("Wrong Username or Password");
                    res.status(409).send({error: 'Unauthorized: Wrong Username or Password'});
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getUsersPosts = async (req, res, next) => {
    console.log("Trying get " + req.params.handle + " posts...");
    try {
        await Upload.find({"handle": req.params.handle}, function(err, posts) {
            if (err) {
                console.log(err);
            } else {
                res.status(201).send({posts: posts});
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getVoteContent = async (req, res, next) => {
    console.log(req.params.handle + " is trying to get songs to vote on...");
    try {
        let content = await Upload.find({_id: {$nin: req.body.lst}, "handle": {$nin: req.params.handle}}).limit(10);
        res.status(201).send({content});
    } catch (err) {
        console.log(err);
    }
}

exports.getRankedContent = async (req, res, next) => {
    console.log("Trying get ranked songs...");
    try {
        let content = await Upload.find().sort('-upvotes').limit(5+parseInt(req.params.timesVoted));
        res.status(201).send({content});
    } catch (err) {
        console.log(err);
    }
}

exports.postContent = async (req, res, next) => {
    console.log("Trying to post content...");
    try {
        let upload = await new Upload({
            _id: new mongoose.Types.ObjectId(),
            handle: req.body.handle,
            content: req.body.content
        });
        await upload.save();
        console.log("Saved content to Mongo!");
        res.status(200).send({});
    } catch (err) {
        console.log(err);
    }
}

exports.castVote = async (req, res, next) => {
    console.log("Trying to cast content vote for ID: " + req.params.contentId + "...");
    let data = req.params.contentId.split("_");
    try {
        let doc = await Upload.findById(data[1]);
        if (data[0] === "up") {
            doc.upvotes = doc.upvotes + 1
        } else if (data[0] === "dn") {
            doc.downvotes = doc.downvotes + 1
        } else if (data[0] === "in") {
            doc.inappropriate = doc.inappropriate + 1
        }

        if (doc.inappropriate >= 5) {
            console.log("Going to DELETE!")
            await Upload.findOneAndDelete({_id: doc._id}, function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send({error: "/deleteRoom - error"});
                } else {
                    console.log("deleted");
                    res.status(200).send({});
                }
            });
        } else {
            await doc.save();
            res.status(201).send({});
        }
    } catch (err) {
        console.log(err);
    }
}
