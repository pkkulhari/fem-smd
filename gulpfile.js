const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const browsersync = require('browser-sync').create()

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

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: { baseDir: '.' },
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
  watch('*.html', browserSyncReload)
  watch('src/sass/**/*.scss', series(sassTask, browserSyncReload))
  watch('src/js/**/*.js', series(jsTask, browserSyncReload))
}

// Default Gulp Task
exports.default = series(sassTask, jsTask, browserSyncServe, watchTask)
