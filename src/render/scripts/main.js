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
    // Remove coffeescript from autodetected languages
	languages: hljs.listLanguages().filter(function (lang) {
		return ['coffeescript'].indexOf(lang) === -1;
	})
 })
hljs.initHighlightingOnLoad();
var codeBlocks = document.querySelectorAll('code');
for (var i = 0; i < codeBlocks.length; i++) {
	hljs.highlightBlock(codeBlocks[i]);
};

/*
 * Keep recent dates displayed as relative measures
 */
 function setupRelativeDates() {
    function relativeDates() {
        var timeElems = document.querySelectorAll('time[datetime]');
        for (var elemIndex = 0; elemIndex < timeElems.length; elemIndex++) {
            var timeElem = timeElems[elemIndex];
            var isoString = timeElem.getAttribute('datetime');
            timeElem.textContent = prettyDate(isoString);
        }
    }
    relativeDates();
    setInterval(relativeDates, 1000);
    /*
     * JavaScript Pretty Date
     * Copyright (c) 2011 John Resig (ejohn.org)
     * Licensed under the MIT and GPL licenses.
     */
    // Takes an ISO time and returns a string representing how
    // long ago the date represents.
    function prettyDate (time) {
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
}
setupRelativeDates();

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
	}]);

function setupFadeNav() {
    var delta = 10;
    var navbar = document.querySelector(".navbar"),
        body = document.querySelector("body");
    var lastScrollTop = 0;
    var didScroll = false;
    window.addEventListener('scroll', function() {
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var scrollTop = body.scrollTop;
        if (scrollTop <= navbar.offsetHeight) {
            DOMUtils.removeClass(navbar, "shadow");
            DOMUtils.addClass(navbar, "top");
        } else {
            DOMUtils.removeClass(navbar, "top");
            DOMUtils.addClass(navbar, "shadow");
        }
        if (Math.abs(scrollTop - lastScrollTop) < delta)
            return;
        if (scrollTop < lastScrollTop) {
            DOMUtils.removeClass(navbar, "hide");
        } else {
            if (scrollTop > navbar.offsetHeight) {
                DOMUtils.addClass(navbar, "hide");
            }
        }
        lastScrollTop = scrollTop;
    }
}
setupFadeNav();





var DOMUtils = (function () {
    var _ = {};
    
    _.testParents = function(e, f) {
        return (f(e) ? true : f(e.parentElement));
    }
    
    _.hasParentClass = function (e, c) {
        return _.testParents(e, function(el) {
            return e.classList.contains(c);
        });
    }
    
    _.removeElem = function (e) {
        e.parentElement.removeChild(e);
    }
    
    _.getAttr = function (e, a) {
        return e.attributes.getNamedItem(a).nodeValue;
    }
    
    var getClassList = function (e) {
        return e.className.split(" ");
    }
    
    var setClassList = function (e, classes) {
        e.className = classes.join(" ");
    }
    
    _.addClass = function (e, c) {
        if (e.className.split(" ").indexOf(c) === -1) {
            e.className = e.className + " " + c;
        }
        return e;
    }
    
    _.removeClass = function (e, c) {
        var classes = getClassList(e);
        Utils.removeFromList(classes, c);
        setClassList(e, classes);
        return e;
    }
    
    _.toggleClass = function (e, c) {
        var classes = getClassList(e);
        if (!Utils.removeFromList(classes, c)) {
            classes.push(c);
        }
        setClassList(e, classes);
        return e;
    }
    
    return _;
})();

var Utils = (function () {
    var _ = {};
    
    _.forEach = function (a, f) {
        for (var i = 0; i < a.length; i++) {
            f(i, a[i]);
        }
    }
    
    _.forMap = function (o, f) {
        for (var key in o) {
            if(o.hasOwnProperty(key)){
                f(key, o[key]);
            }
        }  
    };
    
    _.removeFromList = function (a, e) {
        var i = a.indexOf(e);
        if (i === -1)
            return false;
        a.splice(i, 1);
        return true;
    };
    
    return _;
})();