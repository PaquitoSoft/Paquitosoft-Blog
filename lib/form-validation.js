var url = require('url'),
	sys = require('sys'),
	validator = require("validator"),
	check = validator.check,
	sanitaize = validator.sanitaze,
	logger = require("./logger.js"),
	utils = require("./../utils.js");

module.exports = function(app) {

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
	
	// Make static content expression local for performance
	var staticContentRegExp = utils.staticContentRegExp;
	
	// This way we are sure the validation errors will be read 
	// once, no matter if there's a redirect
	app.dynamicHelpers({
	    validationErrors: function(req, res) {    
                var result = req.session.validationErrors || [];
                req.session.validationErrors = [];
                return result;                            
	    }
	});

	// This is the function to be executed in every request
	return function(req, res, next) {
		var resource = url.parse(req.url).pathname,
			index = 0,
			validation,
			body = req.body,
			formParam,
			validationErrors = [];
		
		if (staticContentRegExp.test(resource)) { // Don't check static content
			//logger.debug('Form-Validation Module# Skipping static content: ' + resource);
			return next();
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
						logger.debug("Form-Validation module# Required param is missing (null)");
						validationErrors.push({
							formField: key,
							error: "Missing required param"
						});
					}
				});
				
				// Set validation errors in session when needed
				if (validationErrors.length > 0) {
					req.invalidFormParams = true;
		        	req.session.validationErrors = validationErrors;
				}
		
			} else {
				logger.debug("Form-Validation Module# Recurso sin reglas de validacion: " + resource);	
			}
			
			return next();
		}
	}
};
