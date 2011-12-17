
var logger = require('../logger.js'),
	models = require('../models.js'),
	sys = require('sys');

exports.init = function(app) {
	
	// Blog post detail
	app.get('/post/:postId', function(req, res) {
		models.Post.findById(req.params.postId, function(err, post) {
			if (err) return next(err);
			res.render('post', {
				title: 'Post details',
				menu: 'blog',
				post: post
			})
		});		
	});
	
	// Blog post creation/edition
	app.post('/post/:id', function(req, res, next) {
		
	});

	// Blog posts list
	app.get('/blog', function(req, res) {
		models.Post.getLatests(5, function(err, posts) {
			if (err) next(err);
			res.render('blog', {
				title: 'All posts',
				menu: 'blog',
				posts: posts
			});
		});
	});
	
};