var models = require('../models.js'),
	logger = require('../logger.js');

exports.initialize = function(app) {

	// Home page
	app.get('/', function(req, res){
		// Look for the latest posts
		models.Post.getLatests(2, function(err, posts) {
			if (err) return next(err);
			models.Project.getLatests(2, function(err, projects) {
				if (err) return next(err);
				res.render('index', {
			   		title: 'Express',
		    	  	menu: 'home',
	    		  	recentPosts: posts,
	    		  	recentProjects: projects
		  		});	
			});			
		});
	});

	// About page
	app.get('/about', function(req, res) {
		res.render('about', {
			title: 'This is me',
			menu: 'about'
		});
	});

	// Contact page
	app.get('/contact', function(req, res) {
		res.render('contact', {
			title: 'Contact me',
			menu: 'contact'
		});
	});
	
	// Admin area home
	app.get('/admin', function(req, res) {
		logger.debug("Controllers::admin# Rendering admin home page...");
		models.Post.count(function(err, postsCount) {
			if (err) return next(err);
			models.Project.count(function(err, projectsCount) {
				if (err) return next(err);
				res.render('admin/index', {
					title: 'Admin dashboard',
					menu: 'home',
					layout: 'admin/layout',
					postsCount: postsCount,
					projectsCount: projectsCount
				});				
			});
		});
	});

	require('./posts.js').init(app);
	require('./projects.js').init(app);
	
}