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
			// Styles
			styles: [
				"//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css",
				"/styles/main.css"
			],

			// Scripts
			scripts: [
				"/vendor/jquery.min.js",
				"/scripts/script.js"
			]
		}
	},

	// =================================
	// Collections
	// These are collections that will be accessible via our templates
    collections: {
        posts: function() {
            return this.getCollection("documents").findAllLive({
                isPost: true
            }, [{
                date: -1
            }]);
        },

        menus: function() {
            return this.getCollection("documents").findAllLive({
                isMenu: true
            });
        }
    }
};

// Export the DocPad Configuration
module.exports = docpadConfig;