const { dest, watch } = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

const compileTypescript = () => {
    return tsProject.src().pipe(tsProject()).js.pipe(dest('dist'));
};

const compileTypescriptLive = () => {
    watch('src/*.ts', { ignoreInitial: false }, compileTypescript);
};

exports.build = compileTypescript;
exports.dev = compileTypescriptLive;
exports.default = exports.build;
