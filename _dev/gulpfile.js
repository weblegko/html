const path = require('path');
const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sortCSSmq = require('sort-css-media-queries');
const mqpacker = require("@hail2u/css-mqpacker");
const concat = require('gulp-concat');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const imagemin = require('gulp-imagemin')

const changed = require('gulp-changed');
const nunjucksRender = require('gulp-nunjucks-render');

const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const named = require('vinyl-named');
const logger = require('gulplog');

const browserSync = require('browser-sync').create();
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

sass.compiler = require('node-sass');


const srcPath =  'src/';
const buildPath = '../assets/';

const paths = {
    src: {
        html: srcPath + 'html/',
        scss: srcPath + 'scss/',
        fonts: srcPath + 'fonts/',
        data: srcPath + 'data/',
        img: srcPath + 'img/',
        js: srcPath + 'js/',
    },
    build: {
        html: buildPath,
        css: buildPath + 'css/',
        fonts: buildPath + 'fonts/',
        data: buildPath + 'data/',
        img: buildPath + 'img/',
        js: buildPath + 'js/',
    }
};


// пути к файлам css которые надо конкатенировать с vendors.css
const CssForAddToVendors = [
    './node_modules/slick-carousel/slick/slick.css',
    './node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css',
    './node_modules/csshake/dist/csshake-slow.min.css'
];

// плагины postcss
const postcssPlugins = [
    autoprefixer({
        overrideBrowserslist: ['last 2 versions']
    }),
    mqpacker({
        sort: sortCSSmq
    }),
    //!isDevelopment ? cssnano() : false
].filter(Boolean);



/* Server by browserSync*/
gulp.task('serve', function(done) {
    browserSync.init({
        server: buildPath,
        //proxy: "site.ru" // если работаем с другим вебсервером
    });
    browserSync.watch([buildPath + 'js/*.*', buildPath + '../**/*.php']).on('change', browserSync.reload);
    done();
});



gulp.task('html', () => {
    return gulp.src(paths.src.html+'pages/**/*.html')
        .pipe(changed(paths.build.html, {
            extension: '.html'
        }))
        .pipe(nunjucksRender({ path: [paths.src.html, paths.src.html + 'layouts/', paths.src.html + 'partials/'] }))
        .pipe(gulp.dest(paths.build.html));
});

gulp.task('htmlLayoutPartials', () => {
    return gulp.src(paths.src.html + 'pages/**/*.html')
        .pipe(nunjucksRender({ path: [paths.src.html, paths.src.html + 'layouts/', paths.src.html + 'partials/'] }))
        .pipe(gulp.dest(paths.build.html));
});



gulp.task('scss', () => {
    return gulp.src(paths.src.scss + 'main.scss')
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: err.plugin,
                message: err.message
            }))
        }))
        .pipe(sass({
            includePaths: ['node_modules'],
            outputStyle: 'expanded',
            precision: 8
        }))
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest(paths.build.css))
        .pipe(browserSync.stream());
});



gulp.task('scss_vendors', () => {
    return gulp.src(paths.src.scss + 'vendors.scss')
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: err.plugin,
                message: err.message
            }))
        }))
        .pipe(sass({
            includePaths: ['node_modules'],
            outputStyle: 'expanded',
            precision: 8
        }))
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest(paths.build.css))
});



gulp.task('css_vendors', () => {
    console.log('Добавим CSS из заданного списка');
    return gulp.src([ 
            paths.build.css + 'vendors.css',
            ...CssForAddToVendors
        ])
        .pipe(concat('vendors.css'))
        .pipe(gulp.dest(paths.build.css));
});



gulp.task('webpack', callback => {
    
    let firstBuildReady = false;

    function done(err, stats) {
        firstBuildReady = true;

        if (err) {
            return;
        }

        logger[stats.hasErrors() ? 'error' : 'info'](stats.toString({
            colors: true
        }));

    }

    let options = {
        watch: isDevelopment,
        mode: isDevelopment ? 'development' : 'production',
        devtool: isDevelopment ? 'inline-source-map' : false,
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            })
        ],
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        '@babel/preset-env'
                    ],
                    plugins: [
                        '@babel/plugin-proposal-class-properties'
                    ]
                }

            }]
        },
        optimization: {
            noEmitOnErrors: true,
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        }
    };

    return gulp.src(paths.src.js + 'main.js')
        .pipe(plumber({
            errorHandler: notify.onError(err => ({
                title: err.plugin,
                message: err.message
            }))
        }))
        .pipe(named())
        .pipe(webpackStream(options, null, done))
        // .pipe(gulpif(!isDevelopment, uglify()))
        .pipe(gulp.dest(paths.build.js))
        .on('data', () => {
            if (firstBuildReady) {
                callback();
            }
        });
});


gulp.task('fonts', () => {
    return gulp.src(paths.src.fonts + '**/*.{ttf,eot,svg,woff,woff2,otf,css}')
        .pipe(changed(paths.build.fonts))
        .pipe(gulp.dest(paths.build.fonts));
});


gulp.task('data', () => {
    return gulp.src(paths.src.data + '**/*.*')
        .pipe(changed(paths.build.data))
        .pipe(gulp.dest(paths.build.data));
});


gulp.task('img', () => {
    return gulp.src(paths.src.img + '**/*.{gif,png,jpg,svg,webp}')
        .pipe(changed(paths.build.img))
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({
              quality: 75,
              progressive: true
            }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
              plugins: [
                { removeViewBox: true },
                { cleanupIDs: false }
              ]
            })
          ]))
        .pipe(gulp.dest(paths.build.img));
});


gulp.task('clean', (done) => {
    del([buildPath], {
        force: true
    });
    done();
});


gulp.task('watch', (done) => {
    
    gulp.watch(paths.src.html + 'pages/**/*.html', gulp.series('html')).on('change', browserSync.reload);;
    
    gulp.watch([
        paths.src.html + 'layouts/**/*.html',
        paths.src.html + 'partials/**/*.html'
    ], gulp.series('htmlLayoutPartials')).on('change', browserSync.reload);;

    gulp.watch([
        paths.src.scss + 'vendors.scss',
        paths.src.scss + 'vendors/**/*.scss'
    ], gulp.series('scss_vendors', 'css_vendors'));

    gulp.watch([
        paths.src.scss + '**/*.scss',
        '!' + paths.src.scss + 'vendors.scss',
        '!' + paths.src.scss + 'vendors/**/*.scss'
    ], gulp.series('scss'));

    gulp.watch(paths.src.js + '**/*.js', gulp.series('webpack'));

    gulp.watch(paths.src.fonts + '**/*.{ttf,eot,svg,woff,woff2,otf}', gulp.series('fonts')).on('unlink', filepath => {
        del.sync(path.resolve(paths.build.fonts, path.relative(path.resolve(paths.src.fonts), filepath)));
    });

    gulp.watch(paths.src.data + '**/*.*', gulp.series('data')).on('unlink', filepath => {
        del.sync(path.resolve(paths.build.data, path.relative(path.resolve(paths.src.data), filepath)));
    });

    gulp.watch(paths.src.img + '**/*.{jpg,png,gif,svg}', gulp.series('img')).on('unlink', filepath => {
        del.sync(path.resolve(paths.build.img, path.relative(path.resolve(paths.src.img), filepath)));
    });

    done();
});


gulp.task('build', gulp.series('clean', 'scss_vendors', gulp.parallel('html', 'css_vendors', 'scss', 'webpack', 'fonts', 'img')));
gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));

