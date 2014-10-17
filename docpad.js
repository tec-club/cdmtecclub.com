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
				"/styles/main.css"
			],

			// Scripts
			scripts: [
				// "/vendor/jquery.min.js",
				"//ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js",
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
    				url: 'http://localhost:9778'
    			}
    		}
    	}
    },

    plugins: {
    	marked: {
		    markedOptions: {
		    	smartypants: true
		    }
		}
	}
};

docpadConfig.templateData.helpers = {
	baseUrl: function (url) {
		if (url instanceof Array) {
			for (var i = 0; i < url.length; i++) {
				url[i] = docpadConfig.templateData.helpers.baseUrl(url[i]);
			}
			return url;
		} else {
			return url.replace('%baseUrl%', docpadConfig.templateData.site.url);
		}
	}
};

// Export the DocPad Configuration
module.exports = docpadConfig;