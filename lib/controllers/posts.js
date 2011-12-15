
var logger = require('../logger.js'),
	models = require('../models.js');

exports.init = function(app) {
	
	// Blog post detail
	app.get('/post/:id', function(req, res) {
		res.render('post', {
			title: 'Post details',
			menu: 'blog'
		})
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