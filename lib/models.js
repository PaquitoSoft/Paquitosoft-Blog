var logger = require('./logger.js');
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

// User model
var UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    registeredAt: { type: Date, required: true, 'default': new Date() },
    role: { type: String, required: true, 'default': 'user' }
});
UserSchema.statics.validateCredentials = function(login, password, callback) {
    logger.debug("UserSchema::validate# Validating user: " + login + " -- " + password);
    this.findOne({ email: login, 'password': password}, callback);
};
UserSchema.methods.getPosts = function(callback) {
    Post.find({ 'author': this.email }, callback);
};


// Post model
var PostSchema = new Schema({
    title: { type: String, required: true },
    postedAt: { type: Date, required: true, 'default': new Date() },
    content: { type: String, required: true },
    author: { type: String, required: true },
    imageName: { type: String, required: true },
    comments: [CommentSchema], 
    tags: [String] 
});
PostSchema.virtual('brief').get(function() {
	var index = this.content.indexOf(" ", 100);
	return (index <= 100) ? this.content : this.content.substring(index) + "...";
});
PostSchema.statics.getLatests = function(count, callback) {
	logger.debug("PostSchema::getLatests# Count: " + count);
	this.find({}).limit(5).desc('postedAt').exec(callback);
};
PostSchema.statics.byAuthor = function(authorLogin, callback) {
    logger.debug("PostSchema::byAuthor# Author: " + authorLogin);
    this.find({ author: authorLogin }, [], { desc: 'postedAt' }, callback);
};
PostSchema.statics.findAllTags = function(callback) {
    logger.debug("PostSchema::findAllTags# entering...");    
    this.find({}, ['tags'], function(err, tags) {
            if (err) return callback(err);
            var result = [];
            for (var i = 0; i < tags.length; i++) {
                result = result.concat(tags[i].tags);
            }
            callback(null, result);
    });
};


// Comment model
var CommentSchema = new Schema({
    author: { type:String, required: true },
    postedAt: { type: Date, required: true, 'default': new Date() },
    content: { type: String, required: true }
});


// Project model
var ProjectSchema = new Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    category: {type: String, required: true},
    description: { type: String, required: true },
    publishingDate: { type: Date, required: true, 'default': new Date() },
    url: { type: String },
    imageName: { type: String, required: true },
    features: [String]
});
ProjectSchema.statics.getLatests = function(count, callback) {
	this.find({}).limit(count).desc('publishingDate').exec(callback);
};


// Initialize models
exports.initialize = function() {
	exports.User = Mongoose.model('User', UserSchema);
	exports.Post = Mongoose.model('Post', PostSchema);
	exports.Comment = Mongoose.model('Comment', CommentSchema);
    exports.Project = Mongoose.model('Project', ProjectSchema);
	logger.debug("Models registered!");
};
