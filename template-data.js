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

var projects = [{
    name: "Paquitometer",
    title: "Network traffic monitor",
    description: "Desktop application written with [**GAMBAS**](http://gambas.sourceforge.net/en/main.html) to run on linux machines.",    
    publishingDate: new Date(2005,5,8),
    url: "http://sourceforge.net/projects/paquito-meter/",
    features: ["Monitor yor incoming and outgoing traffic", "Historical statistics of your network usage"]
},
{
    name: "Namtia",
    title: "Music player",
    description: "Namtia is not only a music player, it's also a way of manage your songs library.",
    publishingDate: new Date(2006,11,26),
    url: "http://sourceforge.net/projects/namtia/",
    features: ["Play your music files", "Organize your library", "View songs lyrics", "Easy searching/browsing capabilities"]
},
{
    name: "LML",
    title: "Java annotations persistence library",
    description: "This is a Java library to help developers when working with relational databases. Based on annotations, you just have to decorate your POJOs to handle its persistent state.",
    publishingDate: new Date(2008, 4, 8),
    url: "http://sourceforge.net/projects/lml/",
    features: ["Annotation based", "Use your own POJOs", "Very small", "Easy to use"]
},
{
    name: "Notimoo",
    title: "Wen Growl style notifications",
    description: "This is a [Mootools](http://www.mootools.net) plugin for web developers so they can show asynchronous notifications to their users",
    publishingDate: new Date(2009,12,12),
    url: "https://github.com/PaquitoSoft/Notimoo",
    features: ["Great out-of-the-box defaults", "Highly customizable"]
},
{
    name: "Notiquery",
    title: "Wen Growl style notifications",
    description: "This is a [jQuery](http://wwwjquery.com) plugin for web developers so they can show asynchronous notifications to their users",
    publishingDate: new Date(2011,11,18),
    url: "https://github.com/PaquitoSoft/Notiquery",
    features: ["Great out-of-the-box defaults", "Highly customizable"]
}];

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
    var project;
    for (var index = 0; index < projects.length; index++) {
        project = new models.Project(projects[index]);
        project.save(function(err) {
            if (err) {
				logger.error("There was an error creating a sample project.", err);
			}
        });
    }
};
    