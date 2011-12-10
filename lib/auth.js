/*!
 * Paquitosoft blog Authentication & Authorization module
 * Author: Paquitosoft
 * Date: 2011-12-09
 * MIT Licensed
 */
var url = require('url');
var logger = require('./logger.js');

/**
 * 
 *
 * @return {Function}
 * @api public
 */
module.exports = function auth(){
			
	/**
	 * Normalize the given path string,
	 * returning a regular expression.
	 *	This function is borrowed from Express (Connect) routing module.
	 *
	 * @param  {String} path
	 * @return {RegExp}
	 * @api private
	 */
	function normalizePath(path) {
	  path = path
	    .concat('/?')
	    .replace(/\/\(/g, '(?:/')
	    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
	      slash = slash || '';
	      return ''
	        + (optional ? '' : slash)
	        + '(?:'
	        + (optional ? slash : '')
	        + (format || '') + (capture || '([^/]+?)') + ')'
	        + (optional || '');
	    })
	    .replace(/([\/.])/g, '\\$1')
	    .replace(/\*/g, '(.+)');
	  return new RegExp('^' + path + '$', 'i');
	}
	
	// Routes configuration
/*	var config = {};
	config[normalizePath("/admin/?")] = ['admin'];
	config[normalizePath("/admin/*")] = ['admin']; */
	var config = [
		{
			pattern: normalizePath("/admin/?"),
			roles: ['admin']
		},
		{
			pattern: normalizePath("/admin/*"),
			roles: ['admin']
		}
	];
	var configLen = config.length;
	
	// Static content expression
	var staticContentRegExp = new RegExp("([^/]+).(jpg|bmp|jpeg|gif|png|tif|css|js)", "i");
	
	
	// Actual module returned to Express
	return function(req, res, next){
		var resource = url.parse(req.url).pathname,
			index = 0,
			matchedRoute;
		
		// Check if requested resource is protected
		if (staticContentRegExp.test(resource)) { // Don't check static content
			logger.debug('AuthModule# Skipping static content: ' + resource);
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
				next();
				
			} else {
				// Requested resource is not protected
				logger.debug("AuthModule# Resource not protected: " + resource);
				next();
			}
		}
	};
};