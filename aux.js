//var req = require('request');

function sayHello() {
	console.log("Hello there!");
	console.log(require.paths);
        console.log(require.resolve('request'));
}

sayHello();
