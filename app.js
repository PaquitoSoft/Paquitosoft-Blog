
/**
 * Module dependencies.
 */
var express = require('express'),
	logger = require('./lib/logger.js'),
	mongoose = require('mongoose'),
	models = require('./lib/models.js'),
	controllers = require('./lib/controllers'),
	sys = require('sys'),
	auth = require('./lib/auth.js'),
	connect_gzip = require('connect-gzip'),
	assetManager = require('connect-assetmanager');

// Environment settings
var EXPRESS_PORT = process.env.PORT || 4000;
var MONGO_URL = process.env.PSBLOG_MONGODB_URL || 'mongodb://localhost:27017/ps-blog';
var SESSION_SECRET_HASH = process.env.PS_BLOG_SESSION_SECRET_HASH || 'FSD423HIHFSD9HLKNVJJDjkf33d3';

// Create Express server
var app = module.exports = express.createServer();

// Configure minified assets
var assets = assetManager({
	js: {
		route: /\/app.js/,
		path: './public/scripts/',
		dataType: 'javascript',
		files: [
			'jquery-1.6.2.min.js',
			'jquery.mousewheel-3.0.4.pack.js',
			'jquery.nivo.slider.pack.js',
			'nivo-options.js',
			'panelslide.js',
			'custom.js',
			'scrolltopcontrol.js',
			'jquery.fancybox-1.3.4.pack.js',
			'jquery.easing-1.3.pack.js'
		]
	},
	css: {
		route: /\/styles.css/,
		path: './public/stylesheets/',
		dataType: 'css',
		files: [
			'site.css',
			'nivo-slider.css',
			'nivo-theme.css',
			'jquery.fancybox-1.3.4.css'
		]
	}
});


/* ===== START: Express configuration ===== */

// Default
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(connect_gzip.gzip());
  app.use(express.responseTime());
  //app.use(express.profiler());
  app.use(auth());
  app.use(express.cookieParser());
  app.use(express.session({secret: SESSION_SECRET_HASH}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));  
  app.use(express.logger('dev'));  
  app.use(express.csrf());
  app.use(assets);
});

// Development
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

// Production
app.configure('production', function(){
  app.use(express.errorHandler()); 
});


// This is the way we can register more common local variables 
// for the template engine using request and response objects
app.dynamicHelpers({
    csrf_token: function(req, res) {
        return req.session._csrf;
    }
});

/* END: Express configuration */

// Initialize routes
controllers.initialize(app);


/* ===== START: Mongoose connection events ===== */
mongoose.connection.on('open', function() {
	logger.debug("Connected to MongoDB");	
});

mongoose.connection.on('error', function(err) {
    logger.error('ERROR trying to connect to MongoDB from Express application.', err);
});
/* END: Mongoose connection events */

// Kickstart!
app.listen(EXPRESS_PORT, function() {
	logger.debug("Listening port: " + EXPRESS_PORT);
	logger.debug("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
	logger.debug("Version de Express: " + express.version);
	logger.info("Server up and running!");
	models.initialize();
	mongoose.connect(MONGO_URL);
});
