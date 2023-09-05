// function tarea(callBack) {
//   console.log("mi primer tarea");
//   callBack();
// }

// exports.tarea = tarea;

const { src, dest, watch, parallel } = require("gulp");

// Css
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

// Imagenes
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

// Js
const terser = require("gulp-terser-js");

function css(callBack) {
  src("src/scss/**/*.scss") // Identificar el archivo de sass --src--
    .pipe(sourcemaps.init()) //iniciar el source map
    .pipe(plumber())
    .pipe(sass()) // Compilarlo
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css")); // Guardarlo en el disco duro --dest--

  callBack(); //callBack que avisa a gulp cuando llegamos al final
}

function imagenes(callBack) {
  const opciones = {
    optimizationLevel: 3,
  };
  src("src/img/**/*.{png,jpg}")
    .pipe(cache(imagemin(opciones)))
    .pipe(dest("build/img"));
  callBack();
}

function versionWebp(callBack) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}").pipe(webp(opciones)).pipe(dest("build/img"));
  callBack();
}

function versionAvif(callBack) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}").pipe(avif(opciones)).pipe(dest("build/img"));
  callBack();
}

function javascript(callBack) {
  src("src/js/**/*.js").pipe(terser()).pipe(dest("build/js"));
  callBack();
}
function dev(callBack) {
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", javascript);
  callBack();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWeb = versionWebp;
exports.versionAvif = versionAvif;

// PAra correr varias tareas maneras de manera secuencial 'parallel'
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
