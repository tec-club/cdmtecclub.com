'use strict';

/* http://cdmtecclub.com angular app
 *
 * Expected to be loaded on every page. Should be very light
 * weight. Should only provide convenience directives for usage
 * in pages and posts.
 */
angular
	.module('cdmtecclub', [])
	/* Created by Alex Wendland (me@alexwendland.com), 2014-10-16
	 *
	 * Directive for dynamically loading code blocks
	 * from a specified remote URL.
	 */
	.directive('remoteCode', ['$http', function dynamicCodeDirective($http) {
		return {
			scope: {
				src: '@',
				syntax: '@'
			},
			restrict: 'EA',
			template: '<pre><code>{{remoteCode}}</code></pre>',
			replace: true,
			link: function dynamicCodeDirectiveLink(scope, elem, attrs) {
				$http.get(scope.src).then(function dynamicCodeGetRemoteCode(resp) {
					scope.remoteCode = resp.data;
				});
			}
		}
	}]);