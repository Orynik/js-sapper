var gulp        = require('gulp')
var browserSync = require('browser-sync').create()
var sass        = require('gulp-sass')(require('sass'))
var minify      = require('gulp-minify')

gulp.task('min-js', function() {
	return gulp.src('js/**/*.js')
		.pipe(minify({
			ext: {
				min: '.min.js'
			},
			ignoreFiles: ['-min.js']
		}))
		.pipe(gulp.dest('public/js'))
})

// Static Server + watching scss/html files
gulp.task('serve', function() {
	browserSync.init({
		server: './public'
	})

	gulp.watch('js/**/*.js', gulp.series('min-js'))
	gulp.watch('scss/**/*.scss', gulp.series('sass'))
	gulp.watch('public/*.html').on('change', browserSync.reload)
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
	return gulp.src('scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.stream())
})

gulp.task('default', gulp.series('sass','min-js', 'serve'))
