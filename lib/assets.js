exports.assetsConfig = {
	js: {
		route: /\/app.js/,
		path: './public/scripts/',
		dataType: 'javascript',
		files: [
			'jquery-1.6.2.min.js',
			'jquery.mousewheel-3.0.4.pack.js',
			'jquery.nivo.slider.pack.js',
			'nivo-options.js',
			'panelslide.js',
			'custom.js',
			'scrolltopcontrol.js',
			'jquery.fancybox-1.3.4.pack.js',
			'jquery.easing-1.3.pack.js',
			'jquery.scrollTo-1.4.2-min.js'
		]
	},
	css: {
		route: /\/styles.css/,
		path: './public/stylesheets/',
		dataType: 'css',
		files: [
			'site.css',
			'nivo-slider.css',
			'nivo-theme.css',
			'jquery.fancybox-1.3.4.css'
		]
	}
};