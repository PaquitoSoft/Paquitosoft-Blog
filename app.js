
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
	formValidation = require('./lib/form-validation.js'),
	connect_gzip = require('connect-gzip'),
	assetsManager = require('connect-assetmanager'),
	assetsConfig = require('./lib/assets.js').assetsConfig,
	templateData = require('./template-data.js'),
	markdown = require("node-markdown").Markdown,
	gravatar = require('gravatar');

// Environment settings
var EXPRESS_PORT = process.env.PORT || 4000;
var MONGO_URL = process.env.PSBLOG_MONGODB_URL || 'mongodb://localhost:27017/ps-blog';
var SESSION_SECRET_HASH = process.env.PS_BLOG_SESSION_SECRET_HASH || 'FSD423HIHFSD9HLKNVJJDjkf33d3';

// Create Express server
var app = module.exports = express.createServer();


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
  app.use(express.logger('dev'));
  app.use(express.csrf());
  app.use(formValidation(app));
  app.use(assetsManager(assetsConfig));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));  
});

// Development
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

// Production
app.configure('production', function(){
  app.use(express.errorHandler()); 
//  logger.setLevel(2);
});


// This is the way we can register more common variables 
// for the template engine using request and response objects
app.dynamicHelpers({
    csrf_token: function(req, res) {
        return req.session._csrf;
    }
});

// This is the way we can register more common functions 
// available in every view template
app.helpers({
	formatMdText: function(text) {
    	return markdown(text, true); // Allow only a default set of HTML tags (http://github.com/andris9/node-markdown/blob/master/lib/markdown.js#L38)
    },
    gravatarUrl: function(email) {
    	return gravatar.url(email);
    }
});

/* END: Express configuration */

// Initialize routes
controllers.initialize(app);


/* ===== START: Mongoose connection events ===== */
mongoose.connection.on('open', function() {
	logger.debug("Connected to MongoDB");
	models.User.count({}, function(err, result) {
		if (result < 1) {
			templateData.initializeDatabase(models);
		}
	});
});

mongoose.connection.on('error', function(err) {
    logger.error('ERROR trying to connect to MongoDB from Express application.', err);
    console.log('ERROR trying to connect to MongoDB from Express application.', err);
    process.exit(23);
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
