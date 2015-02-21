// DocPad Configuration File
// http://docpad.org/docs/config

// Define the DocPad Configuration
var docpadConfig = {

	// =================================
	// Template Data
	// These are variables that will be accessible via our templates
	// To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

	templateData: {
		site: {
			// Base URL
			url: 'http://cdmtecclub.com',

			// Meta
			title: 'TEC Club',
			subtitle: 'Technology, Entrepreneurship, Coding',
			
			// Styles
			styles: [
				"//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css",
				"//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css",
				"/styles/main.css"
			],

			// Scripts
			scripts: [
				// "/vendor/jquery.min.js",
				"//ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js",
				"//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.3/highlight.min.js",
				"/scripts/main.js"
			]
		}
	},

	// =================================
	// Collections
	// These are collections that will be accessible via our templates
    collections: {
        posts: function() {
            return this.getCollection("documents").findAllLive({
                type: "post"
            }, [{
                date: -1
            }]);
        },

        workshops: function() {
        	return this.getCollection("documents").findAllLive({
                type: "workshop"
            });
        },

        menus: function() {
            return this.getCollection("documents").findAllLive({
                isMenu: true
            });
        }
    },

    environments: {
    	development: {
    		templateData: {
    			site: {
    				url: 'http://localhost:9778',
	    			styles: [
						"/local/normalize.min.css",
						"/local/font-awesome.min.css",
						"/styles/main.css"
	    			],
	    			scripts: [
	    				"/local/angular.min.js",
	    				"/local/highlight.min.js",
						"/scripts/main.js"
	    			]
    			}
    		}
    	}
    },

    plugins: {
    	marked: {
		    markedOptions: {
		    	smartypants: false // currently, true turns ' and " into smart quotes in code blocks
		    }
		}
	}
};

docpadConfig.templateData.helpers = {
	// Prepend a URL with the site's root url
	baseUrl: function (url) {
		if (url instanceof Array) {
			for (var i = 0; i < url.length; i++) {
				url[i] = docpadConfig.templateData.helpers.baseUrl(url[i]);
			}
			return url;
		} else {
			return url.replace('%baseUrl%', docpadConfig.templateData.site.url);
		}
	},

	// Escape a String of HTML into HTML Entities
	escapeHtmlString: function (str) {
		return str.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&apos;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
	},

	/*
	 * JavaScript Pretty Date
	 * Copyright (c) 2011 John Resig (ejohn.org)
	 * Licensed under the MIT and GPL licenses.
	 */
	// Takes an ISO time and returns a string representing how
	// long ago the date represents.
	prettyDate: function (time) {
		var date = time instanceof Date ? time : new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);
	
		if (diff < 60) {
			return "just now"
		}
		else if (diff < 120) {
			return "1 minute ago";
		}
		else if (diff < 3600) {
			return Math.floor( diff / 60 ) + " minutes ago";
		} else if (diff < 7200) {
			return "1 hour ago";
		} else if (diff < 86400) {
			return Math.floor( diff / 3600 ) + " hours ago";
		} else if (day_diff == 1) {
			return "Yesterday";
		} else if (day_diff < 7) {
			return day_diff + " days ago";
		} else if (day_diff < 31) {
			return Math.ceil( day_diff / 7 ) + " weeks ago";
		} else {
			var months = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
			return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
		}
	}
};

// Export the DocPad Configuration
module.exports = docpadConfig;