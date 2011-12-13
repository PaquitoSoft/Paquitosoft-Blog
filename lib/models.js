var logger = require('./logger.js');
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema,
    ObjectId = Mongoose.ObjectId;

// User model
var UserSchema = new Schema({
	identifier: { type: Number, required: true, unique: true, 'default': Date.now() },
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    role: { type: String, required: true, 'default': 'user' }
});
UserSchema.pre('save', function(next) {
	populateIdentifier('User', this, next);
});
UserSchema.statics.validateCredentials = function(login, password, callback) {
    console.log("UserSchema::validate# Validating user: " + login + " -- " + password);
    this.findOne({ email: login, 'password': password}, callback);
};
UserSchema.methods.getPosts = function(callback) {
    Post.find({ 'author': this.email }, callback);
};


// Post model
var PostSchema = new Schema({
	identifier: { type: Number, required: true, unique: true, 'default': Date.now() },
    title: { type: String, required: true },
    postedAt: { type: Date, required: true, 'default': new Date() },
    content: { type: String, required: true },
    author: { type: String, required: true },
    comments: [CommentSchema], 
    tags: [String] 
});
PostSchema.pre('save', function(next) {
	populateIdentifier('Post', this, next);
});
PostSchema.statics.byAuthor = function(authorLogin, callback) {
    console.log("PostSchema::byAuthor# Author: " + authorLogin);
    this.find({ author: authorLogin }, [], { desc: 'postedAt' }, callback);
};
PostSchema.statics.findAllTags = function(callback) {
    console.log("PostSchema::findAllTags# entering...");    
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
    postedAt: { type: Date, required: true, 'default': function() { return new Date(); } },
    content: { type: String, required: true }
});


// Just a counter for more friendly models indentifiers
var populateIdentifier = function(modelName, instance, next) {	
	Mongoose.model(modelName).count({}, function(err, count) {
		if (err) { next(err); };
		instance.identifier = count + 1;
		next();
	});
};


// Initialize models
exports.initialize = function() {
	exports.User = Mongoose.model('User', UserSchema);
	exports.Post = Mongoose.model('Post', PostSchema);
	exports.Comment = Mongoose.model('Comment', CommentSchema);
	logger.debug("Models registered!");
};
