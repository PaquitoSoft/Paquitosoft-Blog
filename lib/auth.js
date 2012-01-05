/*!
 * Paquitosoft blog Authentication & Authorization module
 * Author: Paquitosoft
 * Date: 2011-12-09
 * MIT Licensed
 */
var url = require('url'),
    utils = require('../utils.js'),
    logger = require('./logger.js');

/**
 * 
 *
 * @return {Function}
 * @api public
 */
module.exports = function auth(app){

	// Routes configuration
	var config = [
		{
			pattern: utils.normalizePath("/admin/?"),
			roles: ['admin']
		},
		{
			pattern: utils.normalizePath("/admin/*"),
			roles: ['admin']
		}
	];
	var configLen = config.length;
	
	// Static content expression
	//var staticContentRegExp = new RegExp("([^/]+).(jpg|bmp|jpeg|gif|png|tif|css|js|ico)", "i");
        var staticContentRegExp = utils.staticContentRegExp;

	// Actual module returned to Express
	return function(req, res, next){
		var resource = url.parse(req.url).pathname,
			index = 0,
			matchedRoute,
                        currentUser;
		// logger.debug("AuthModule# Requested resource: " + resource);
		
		// Check if requested resource is protected
		if (staticContentRegExp.test(resource)) { // Don't check static content
			//logger.debug('AuthModule# Skipping static content: ' + resource);
			next();
		} else {
			for (index; index < configLen; index += 1) {
				if (config[index].pattern.test(resource)) {
					matchedRoute = config[index];
					break;
				}				
			}
			if (matchedRoute) {
				
				// TODO Check if user is connected and has an allowed role
				logger.debug("AuthModule# TODO Check if user has allowed roles: " + matchedRoute.roles);
                                currentUser = req.session.currentUser;
                                if (currentUser) {
                                    next();
                                } else {
                                    res.redirect('/login');
                                }
				
				
			} else {
				// Requested resource is not protected
				logger.debug("AuthModule# Resource not protected: " + resource);
				next();
			}
		}
	};
};