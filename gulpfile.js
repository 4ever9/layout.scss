const { src, dest, watch, parallel, series } = require("gulp")
const connect = require("gulp-connect")
const sass = require("gulp-sass")
sass.compiler = require("node-sass")
const babel = require("gulp-babel")

const resources = {
  js: "src/js/app.js",
  scss: "src/scss/**/*.scss",
  html: "./*.html",
}

const includePaths = ["node_modules/@forever9/lego"]

function serve() {
  return connect.server({
    root: ".",
    livereload: true,
    port: 3030,
  })
}

function compileJs() {
  return src(resources.js)
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(dest("./dist"))
    .pipe(connect.reload())
}

function compileScss() {
  return src(resources.scss)
    .pipe(
      sass({
        // outputStyle: "compressed",
        includePaths: includePaths,
      }).on("error", sass.logError)
    )
    .pipe(dest("./dist"))
    .pipe(connect.reload())
}

exports.build = parallel(compileJs, compileScss)
exports.default = parallel(compileJs, compileScss)

function html() {
  return src(resources.html).pipe(connect.reload())
}

exports.dev = series(
  parallel(compileScss, compileJs),
  parallel(serve, function () {
    watch(resources.scss, compileScss)
    watch(resources.js, compileJs)
    watch(resources.html, html)
  })
)
