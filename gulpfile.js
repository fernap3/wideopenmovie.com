const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const rimraf = require("rimraf");

gulp.task("build-debug", () =>
{
	rimraf("deploy", () => {
		gulp.src(["images/**/*"]).pipe(gulp.dest("deploy/images"));
		gulp.src(["src/**/*.html"]).pipe(gulp.dest("deploy"));
		gulp.src(["src/**/*.css"]).pipe(gulp.dest("deploy"));
		
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
	gulp.src(["images/**/*"]).pipe(gulp.dest("deploy/images"));
	gulp.src(["src/**/*.html"]).pipe(gulp.dest("deploy"));
	gulp.src(["src/**/*.css"]).pipe(gulp.dest("deploy"));

	rimraf("deploy", () => {
		const tsProject = ts.createProject("tsconfig.json");
		return tsProject.src()
			.pipe(tsProject()).js
			.pipe(gulp.dest("deploy/"));
	});
});
