var logger = require('./lib/logger.js');

var user = {
    email: "paquitosoftware@gmail.com",    
    password: "terces",
    fullname: "Paquitosoft",
    role: "admin"	
};

var post1 = {	
    title: "In the beginning...",
    content: "*In the beginning there was nothing and then, there was a big explosion*. In my universe, there were multiple development technologies " +
    			"hanging around in the internet, but suddenly, there was a boom called **Node.js**.",
    author: "paquitosoftware@gmail.com",
    comments: {    	
    	author: "John Doe",
	    postedAt: new Date(),
    	content: "Man, I think you should go to a shrink."
    }, 
    tags: ["general"] 

};

var post2 = {
	title: "My latest JS discoveries",
	author: "paquitosoftware@gmail.com",
	content: "I would like to talk to you about the latest **Javascript libraries** I discovered.",
	tags: ["development", "javascript"]
};

exports.initializeDatabase = function(models) {
	var user1 = new models.User(user);
	user1.save(function(err) {
		if (err) {
			logger.error("There was an error creating template user data.", err);
		}
	});
	var dbPost1 = new models.Post(post1);
	dbPost1.save(function(err) {
		if (err) {
			logger.error("There was an error creating template post1 data.", err);
		}
	});
	setTimeout(function() {
		var dbPost2 = new models.Post(post2);
		dbPost2.save(function(err) {
			if (err) {
				logger.error("There was an error creating template post2 data.", err);
			}
		});	
	}, 1000);
	
}