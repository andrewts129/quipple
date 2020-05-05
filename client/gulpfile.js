const { src, dest, watch, parallel } = require('gulp');
const rename = require('gulp-rename');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

const compileTypescript = () => {
    return tsProject.src().pipe(tsProject()).js.pipe(dest('dist'));
};

const compileTypescriptLive = () => {
    watch('src/*.ts', { ignoreInitial: false }, compileTypescript);
};

const copyStatic = () => {
    return src('public/**/*', { nodir: true })
        .pipe(rename({ dirname: '' }))
        .pipe(dest('dist'));
};

const copyStaticLive = () => {
    watch('public/**/*', { ignoreInitial: false }, copyStatic);
};

exports.build = parallel(compileTypescript, copyStatic);
exports.dev = parallel(compileTypescriptLive, copyStaticLive);
exports.default = exports.build;
