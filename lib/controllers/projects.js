var logger = require('../logger.js'),
	models = require('../models.js'),
	sys = require('sys');

exports.init = function(app) {
	
	// Projects grid
	app.get('/projects', function(req, res) {
		models.Project.getLatests(12, function(err, projects) {
			if (err) return next(err);
			res.render('projects', {
		   		title: 'These are my projects',
				menu: 'projects',
    		  	projects: projects
	  		});	
		});
	});

	// Project detail
	app.get('/project/:projectId', function(req, res, next) {
		models.Project.findById(req.params.projectId, function(err, project) {
			if (err) return next(err);
			res.render('project', {
				title: 'Project 1',
				menu: 'projects',
				project: project
			});
		});		
	});
	
};