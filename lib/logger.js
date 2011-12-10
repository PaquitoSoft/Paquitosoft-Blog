/**
 * Logging levels:
 *
 *	1.- DEBUG
 *	2.- INFO
 *	3.- WARNING
 *	4.- ERROR
 */

var loggly = require('loggly');

var config = { 
	subdomain: process.env.LOGGLY_SUBDOMAIN,
	auth: {
		username: process.env.LOGGLY_USERNAME,
		password: process.env.LOGGLY_PASSWORD
	}
};
var client = loggly.createClient(config);

/*
	Sends to Loggly every message with level INFO or higher.
	Everything goes to stdout also.
*/
function log(message, level) {
	if (level && level > 1) {
		client.log('32423423432432342', message, function(err, result) {
			if (err) {
				console.log("There was a problem logging to loggly: " + err);
				console.log(message);
			} else {
				console.log(message);				
			}
		});
	} else {
		console.log(message);
	}
};

function debug(message) {
	log(message, 1);
};
function info(message) {
	log(message, 2);
};
function warning(message) {
	log(message, 3);
};
function error(message, err) {
	log(message + " -- Error: " + err, 4);
};

exports.log = log;
exports.debug = debug;
exports.info = info;
exports.warning = warning;
exports.error = error;