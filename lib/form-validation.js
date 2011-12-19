var url = require('url'),
	sys = require('sys'),
	validator = require("validator"),
	check = validator.check,
	sanitaize = validator.sanitaze,
	logger = require("./logger.js"),
	utils = require("./../utils.js");

module.exports = function() {
logger.debug("Form-Validation Module# 1");	
	// Routes configuration
	var config = [
		{
			pattern: utils.normalizePath("/post/:postId/comment"),
			restrictions: {
			    email: ['required', 'email'],
				name: ['required'],
			    comment: ['required']
	
			}
		}
	];
	var configLen = config.length;
	
	// Static content expression
	var staticContentRegExp = new RegExp("([^/]+).(jpg|bmp|jpeg|gif|png|tif|css|js|ico)", "i");
	
	return function(req, res, next) {
		var resource = url.parse(req.url).pathname,
			index = 0,
			validation,
			body = req.body,
			formParam,
			validationErrors = [];
		
		if (staticContentRegExp.test(resource)) { // Don't check static content
			//logger.debug('Form-Validation Module# Skipping static content: ' + resource);
			next();
		} else {
		
			logger.debug("Form-Validation Module# Analyzed resource: " + resource);
			for (index; index < configLen; index += 1) {
				if (config[index].pattern.test(resource)) {
					logger.debug("Form-Validation Module# Yeeeepa!!!");
					validation = config[index];
					break;
				}
			}

			if (validation) {
				logger.debug("Form-Validation Module# Validacion encontrada para el recurso recibido: " + sys.inspect(validation));
				
				Object.keys(validation.restrictions).forEach(function(key) {
					formParam = body[key];
					logger.debug("Form-Validation Module# parametro del formulario que vamos a analizar: " + key);
					logger.debug("Form-Validation Module# restricciones: " + validation.restrictions[key]);
					logger.debug("Form-Validation Module# valor en el formulario: " + formParam);
					if (formParam) {
						try {
							validation.restrictions[key].forEach(function(constraint) {
								if ('required' == constraint) {
									check(formParam).notEmpty();
								} else if ('email' == constraint) {
									check(formParam).isEmail();
								} else {
									debug.warn("Form-Validation module# Ignoring unknown validation constraint: " + constraint);
								}
							});	
						} catch (err) {
							logger.debug("Form-Validation module# Error de validacion: " + err);
							validationErrors.push({
								formField: key,
								error: err
							});
						}
						
					} else if (validation.restrictions[key].filter(function(element) {
							return 'required' == element;
						}).length > 0) {
						// TODO This is an error
						logger.debug("Form-Validation module# Required param is missing (null)");
						validationErrors.push({
							formField: key,
							error: "Missing required param"
						});
					}
				});
		
			} else {
				logger.debug("Form-Validation Module# Recurso sin reglas de validacion: " + resource);	
			}
			
			return (validationErrors.length < 1) ? next() : next(validationErrors);
		}
	}
};
