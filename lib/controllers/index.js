exports.initialize = function(app) {

	app.get('/', function(req, res){
  		res.render('index', {
	    title: 'Express',
    	menu: 'home'
	  });
	});

	app.get('/post/:id', function(req, res) {
		res.render('post', {
			title: 'Post details',
			menu: 'blog'
		})
	});

	app.get('/blog', function(req, res) {
		res.render('blog', {
			title: 'All posts',
			menu: 'blog'
		});
	});

	app.get('/about', function(req, res) {
		res.render('about', {
			title: 'This is me',
			menu: 'about'
		});
	});

	app.get('/contact', function(req, res) {
		res.render('contact', {
			title: 'Contact me',
			menu: 'contact'
		});
	});

	app.get('/projects', function(req, res) {
		res.render('projects', {
			title: 'These are my projects',
			menu: 'projects'
		});
	});

	app.get('/project/:id', function(req, res) {
		res.render('project', {
			title: 'Project 1',
			menu: 'projects'
		});
	});
	
	app.get('/admin', function(req, res) {
		res.render('admin/index', {
			title: 'Admin dashboard',
			menu: 'home'
		});
	});
	
}