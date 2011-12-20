
var logger = require('../logger.js'),
	models = require('../models.js'),
	sys = require('sys');

exports.init = function(app) {
	
	// Blog post detail
	app.get('/post/:postId', function(req, res, next) {
		models.Post.findById(req.params.postId, function(err, post) {
			if (err) return next(err);
			res.render('post', {
				title: 'Post details',
				menu: 'blog',
				post: post
			});
		});		
	});
	
	// Blog post new comment
	app.post('/post/:postId/comment', function(req, res, next) {
		// TODO Validate comment data
		models.Post.findById(req.params.postId, function(err, post) {
			if (err) return next(err);
			
			if (req.invalidFormParams) {
				logger.debug("Controllers::Posts# Validation errors creating post comment: " + sys.inspect(req.validationErrors));
				res.render('post', {
					title: 'Post details',
					menu: 'blog',
					post: post
				});		
			} else {
				post.comments.push(new models.Comment({
				    authorEmail: req.body.email,
					authorName: req.body.name,
				    content: req.body.comment
				}));
				/*post.save(function(err) {
					if (err) return next(err);
					res.redirect('/post/' + req.params.postId);
				});*/
				res.redirect('/post/' + req.params.postId);	
			}								
		});	
	});

	// Blog posts list
	app.get('/blog', function(req, res) {
		models.Post.getLatests(5, function(err, posts, next) {
			if (err) next(err);
			res.render('blog', {
				title: 'All posts',
				menu: 'blog',
				posts: posts
			});
		});
	});
	
};