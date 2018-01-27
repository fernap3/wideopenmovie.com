const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const rimraf = require("rimraf");
const uglify = require("gulp-uglifyes");
const rename = require("gulp-rename");
const cleancss = require("gulp-clean-css");
const shell = require("gulp-shell");

gulp.task("build-debug", () =>
{
	rimraf("deploy", () => {
		gulp.src(["images/**/*"]).pipe(gulp.dest("deploy/images"));
		gulp.src(["src/**/*.html"]).pipe(gulp.dest("deploy"));
		gulp.src(["src/**/*.css"]).pipe(gulp.dest("deploy"));
		gulp.src(["src/**/*.ts"]).pipe(gulp.dest("deploy"));
		
		const tsProject = ts.createProject("tsconfig.json");
		return tsProject.src()
			.pipe(sourcemaps.init())
			.pipe(tsProject()).js
			.pipe(sourcemaps.write("."))
			.pipe(gulp.dest("deploy/"));
	});
});

gulp.task("build-deploy", () =>
{
	rimraf("deploy", () => {
		gulp.src(["images/**/*"]).pipe(gulp.dest("deploy/images"));
		gulp.src(["src/**/*.html"]).pipe(gulp.dest("deploy"));
		gulp.src(["src/**/*.css"])
			.pipe(cleancss())
			.pipe(gulp.dest("deploy"));

		const tsProject = ts.createProject("tsconfig.json");
		return tsProject.src()
			.pipe(tsProject()).js
			.pipe(gulp.dest("deploy/"))
			.pipe(uglify())
			.pipe(gulp.dest("deploy/"))
			.pipe(shell(["aws s3 cp deploy/ s3://wideopenmovie.com/ --recursive"]));
	});
});
