'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var fs = require('fs'),
    path = require('path'),
    es = require('event-stream');

gulp.task('common:styles', function () {
    return gulp.src([
            'src/common/styles/**/*.less'
        ])
        .pipe($.plumber())
        .pipe($.concat('common-styles.css'))
        .pipe($.less())
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});

function getFolders(dir){
    return fs.readdirSync(dir)
      .filter(function(file){
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

function getPostPath(post) {
    return path.join(post.date.getFullYear(), post.date.getMonth() + 1, post.slug);
}

function postStylesTask(post) {
    return gulp.src(path.join('src/posts/', post.folder, '/style.less'))
      .pipe($.less())
      .pipe($.autoprefixer('last 1 version'))
      .pipe(gulp.dest('dist', post.dest, 'post-style.css'))
      .pipe($.size());
}

function postMarkdownTask(post) {
    return gulp.src(path.join('src/posts/', post.folder, post.folder + '.md'))
      .pipe($.markdown())
      .pipe(gulp.dest('dist', post.dest, 'index.html'))
      .pipe($.size());
}

function postCopyTask(postName) {
    return gulp.src([
          path.join('src/posts/', postName, '/**/*'),
          path.join('!src/posts/', postName, postname + '.css'),
        ])
      .pipe(gulp.dest(path.join('dist/styles'), postName))
      .pipe($.size());
}

gulp.task('posts', function() {
   var folders = getFolders('src/posts/');

   var posts = folders.map(function(postName) {
      var fileContents = fs.readFileSync(path.join('src/posts/', postName, postName + '.md'), 'utf8'),
          fileHeader = fileContents.split(/\*-+?End Header-+?\*/, 1);

      var post = {
        folder: folder,
        date: new Date(folder.substring(0, 11)),
        // type: folder.split(/\.[-\w]+/), // Everything is md for now
        slug: folder.substring(11).split(/\./, 1),
        header: fileHeader
      };
      post.dest = getPostPath(post);
      return post;
   });

   var postStyles = posts.map(function(post) {
      return postStylesTask(post);
   });

   var postHtml = posts.map(function(post) {
      return postHtmlTask(post);
   });

   var postCopies = posts.map(function(post) {
      return postCopyTask(post);
   });

   return es.concat.apply(null, postStyles, postCopies);
});

function injectHtml(isDev) {
    var bowerFilesJqueryFirst = $.mainBowerFiles({filter: /jquery\.js/}).concat($.mainBowerFiles());
    return gulp.src('app/index.html')
        .pipe(
            $.inject(gulp.src(bowerFilesJqueryFirst, {
                read: false
            }), {
                starttag: '<!-- inject:bower:{{ext}} -->',
                addRootSlash: false,
                ignorePath: isDev ? ['app/', '.tmp/'] : null
            })
        )
        .pipe($.inject(gulp.src(['app/angular/**/*.js'], {
            read: false
        }), {
            read: false,
            starttag: '<!-- inject:{{ext}} -->',
            addRootSlash: false,
            ignorePath: isDev ? ['app/', '.tmp/'] : null
        }))
        .pipe($.inject(gulp.src(['.tmp/styles/**/*.css'], {
            read: false
        }), {
            read: false,
            starttag: '<!-- inject:{{ext}} -->',
            addRootSlash: false,
            ignorePath: isDev ? ['app/', '.tmp/'] : null
        }))
        .pipe(
            $.if(!isDev,
                $.inject(gulp.src('dist/ngviews/ngviews.min.js'), {
                    read: false,
                    starttag: '<!-- inject:ngviews -->',
                    addRootSlash: false
                })
            ))
        .pipe(gulp.dest('.tmp/'))
};

gulp.task('dev:inject', ['dev:styles', 'dev:scripts'], function () {
    return injectHtml(true);
});

gulp.task('build:inject', ['dev:styles', 'dev:scripts', 'build:ngviews'], function () {
    return injectHtml(false);
});

gulp.task('build:ngviews', function () {
    return gulp.src(['app/angular/**/*.html'])
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({
            moduleName: 'interfaceApp',
            prefix: 'angular/'
        }))
        .pipe($.concat('ngviews.min.js'))
        .pipe(gulp.dest('dist/ngviews'))
        .pipe($.size());
});

gulp.task('build:html', ['dev:styles', 'dev:scripts', 'build:ngviews', 'build:inject'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    var assets = $.useref.assets();

    return gulp.src('.tmp/index.html')
        .pipe(assets)
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify({
            preserveComments: saveLicense
        }))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('build:images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('build:fonts', function () {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], {
        read: false
    }).pipe($.rimraf());
});

gulp.task('build', ['build:ngviews', 'build:inject', 'build:images', 'build:fonts', 'build:html']);
