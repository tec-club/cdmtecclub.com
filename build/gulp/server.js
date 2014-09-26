'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');
var httpProxy = require('http-proxy');

/* This configuration allow you to configure browser sync to proxy your backend */
/*
var proxyTarget = 'http://localhost/context/'; // The location of your backend
var proxyApiPrefix = 'api'; // The element in the URL which differentiate between API request and static file request

var proxy = httpProxy.createProxyServer({
  target: proxyTarget
});

function proxyMiddleware(req, res, next) {
  if (req.url.indexOf(proxyApiPrefix) !== -1) {
    proxy.web(req, res);
  } else {
    next();
  }
}
*/

function browserSyncInit(baseDir, files, browser) {
    browser = browser === undefined ? 'default' : browser;

    browserSync.instance = browserSync.init(files, {
        startPath: '/index.html',
        server: {
            baseDir: baseDir
        },
        browser: browser,
        ghostMode: false,
        ports: {
            min: 4000
        }
    });

}

gulp.task('serve', ['watch'], function () {
    browserSyncInit([
        '.tmp',
        'app'
    ], [
        '.tmp/*.html',
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/partials/**/*.html',
        'app/images/**/*',
        'app/angular/**/*'
    ]);
});

gulp.task('serve:dist', ['build'], function () {
    browserSyncInit('dist');
});
