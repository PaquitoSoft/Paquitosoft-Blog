var logger = require('./lib/logger.js'),
	sys = require('sys');

var user = {
    email: "paquitosoftware@gmail.com",    
    password: "terces",
    fullname: "Paquitosoft",
    role: "admin"	
};

var posts = [{	
    title: "In the beginning...",
    content: "*In the beginning there was nothing and then, there was a big explosion*. In my universe, there were multiple development technologies " +
    			"hanging around in the internet, but suddenly, there was a boom called **Node.js**.",
    author: "paquitosoftware@gmail.com",
    comments: [{
    	authorEmail: "paquitosoftware@gmail.com",
    	authorName: "John Doe",
	    postedAt: new Date(),
    	content: "Man, I think you should go to a shrink."
    }],
    imageName: "blog1.jpg",
    tags: ["general"]

},
{
	title: "My latest JS discoveries",
	author: "paquitosoftware@gmail.com",
	content: "I would like to talk to you about the latest **Javascript libraries** I discovered.",
	imageName: "blog2.jpg",
	tags: ["development", "javascript"]
}];

var projects = [{
    name: "Paquitometer",
    title: "Network traffic monitor",
    description: "Desktop application written with [**GAMBAS**](http://gambas.sourceforge.net/en/main.html) to run on linux machines.",    
    category: "Desktop",
    publishingDate: new Date(2005,5,8),
    url: "http://sourceforge.net/projects/paquito-meter/",
    imageName: "project1.jpg",
    features: ["Monitor yor incoming and outgoing traffic", "Historical statistics of your network usage"]
},
{
    name: "Namtia",
    title: "Music player",
    description: "Namtia is not only a music player, it's also a way of manage your songs library.",
    category: "Desktop",
    publishingDate: new Date(2006,11,26),
    url: "http://sourceforge.net/projects/namtia/",
    imageName: "project2.jpg",
    features: ["Play your music files", "Organize your library", "View songs lyrics", "Easy searching/browsing capabilities"]
},
{
    name: "LML",
    title: "Java annotations persistence library",
    description: "This is a Java library to help developers when working with relational databases. Based on annotations, you just have to decorate your POJOs to handle its persistent state.",
    category: "Development",
    publishingDate: new Date(2008, 4, 8),
    url: "http://sourceforge.net/projects/lml/",
    imageName: "project3.jpg",
    features: ["Annotation based", "Use your own POJOs", "Very small", "Easy to use"]
},
{
    name: "Notimoo",
    title: "Web Growl style notifications",
    category: "Web",
    description: "This is a [Mootools](http://www.mootools.net) plugin for web developers so they can show asynchronous notifications to their users",
    publishingDate: new Date(2009,12,12),
    url: "https://github.com/PaquitoSoft/Notimoo",
    imageName: "project4.jpg",
    features: ["Great out-of-the-box defaults", "Highly customizable"]
},
{
    name: "Notiquery",
    title: "Web Growl style notifications",
    description: "This is a [jQuery](http://www.jquery.com) plugin for web developers so they can show asynchronous notifications to their users",
    category: "Web",
    publishingDate: new Date(2011,11,18),
    url: "https://github.com/PaquitoSoft/Notiquery",
    imageName: "project5.jpg",
    features: ["Great out-of-the-box defaults", "Highly customizable"]
}];

exports.initializeDatabase = function(models) {
	var user1 = new models.User(user);
	user1.save(function(err) {
		if (err) {
			logger.error("There was an error creating template user data.", err);
		}
	});
	var post;
	for (var index = 0; index < posts.length; index++) {
		(new models.Post(posts[index])).save(function(err) {
			if (err) {
				logger.error("There was an error creating template post1 data.", err);
			}
		});	
	}	
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
