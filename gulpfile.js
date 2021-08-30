const { src, dest, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const browsersync = require('browser-sync').create()
const htmlmin = require('gulp-htmlmin')

// Sass Task
function sassTask() {
  return src('src/sass/style.scss', { sourcemaps: true })
    .pipe(sass.sync())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }))
}

// JavaScript Task
function jsTask() {
  return src('src/js/main.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }))
}

// HTML Task
function htmlTask() {
  return src('src/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
}

// Image Task
function imgTask() {
  return src('src/images/*').pipe(dest('dist/images'))
}

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: { baseDir: 'dist' },
    browser: 'firefox',
    notify: false,
  })
  cb()
}
function browserSyncReload(cb) {
  browsersync.reload()
  cb()
}

// Watch Task
function watchTask() {
  watch('src/index.html', series(htmlTask, browserSyncReload))
  watch('src/sass/**/*.scss', series(sassTask, browserSyncReload))
  watch('src/js/**/*.js', series(jsTask, browserSyncReload))
  watch('src/images/*', series(imgTask, browserSyncReload))
}

// Gulp Build Task
exports.build = parallel(sassTask, jsTask, htmlTask, imgTask)

// Default Gulp Task
exports.default = series(sassTask, jsTask, htmlTask, imgTask, browserSyncServe, watchTask)
