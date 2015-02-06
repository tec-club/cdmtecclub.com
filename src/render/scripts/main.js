'use strict';

/* 
 * Convenience JavaScript methods
 */
 // Escape a String of HTML into HTML Entitiies
function escapeHtmlString(str) {
	return str.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
}

/*
 * Initialize highlight.js
 */
hljs.configure({
	languages: hljs.listLanguages().filter(function (lang) {
		return ['coffeescript'].indexOf(lang) === -1;
	})
 })
hljs.initHighlightingOnLoad();
var codeBlocks = document.querySelectorAll('code');
for (var i = 0; i < codeBlocks.length; i++) {
	hljs.highlightBlock(codeBlocks[i]);
};

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
	.directive('enhancedCode', ['$http', function enhancedCodeDirective($http) {
		return {
			scope: {
				src: '@?',
				syntax: '@?'
			},
			restrict: 'EAC',
			template: ' <pre class="enhanced-code-container"><code ng-transclude>{{remoteCode}}</code></pre>' +
			'			<div class="actions">' +
			'				<a class="popup" ng-click="openInPopup()"><i class="fa fa-copy"></i></a>' +
			'			</div>',
			transclude: true,
			link: function enhancedCodeDirectiveLink(scope, elem, attrs) {
				elem.addClass('enhanced-code');
				scope.openInPopup = function enhancedCodeOpenInPopup() {
					var popup = window.open('', '_blank', 'toolbar=0,location=0,menubar=0,height=250,width=400');
					popup.document.open();
					popup.document.write('<html><body><pre>' + escapeHtmlString(scope.remoteCode ? scope.remoteCode : elem.find('code').text()) + '</pre></body></html>');
					popup.document.close();
				};
				if (scope.src) {
					$http.get(scope.src).then(function enhancedCodeGetRemoteCode(resp) {
						scope.remoteCode = resp.data;
						elem.find('code').text(scope.remoteCode);
						hljs.highlightBlock(elem.find('code')[0]);
					});
				}
			}
		}
	}])
	/* Created by Alex Wendland (me@alexwendland.com), 2014-10-24
	 *
	 * Directive for displaying recent GitHub activity
	 * of a user/organization
	 */
	.directive('github', ['$http', function githubDirective($http) {
		return {
			scope: {
				user: '@'
			},
			restrict: 'E',
			template: '<ul><li ng-repeat="event in events">{{event}}</li></ul>',
			link: function githubDirectiveLink(scope, elem, attrs) {
				$http.get('https://api.github.com/users/' + scope.user + '/events').then(function githubDirectiveGetEvents(resp) {
					scope.events = resp.data;
				});
			}
		}
	}]);