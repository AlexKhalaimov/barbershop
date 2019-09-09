"use strict";

var config = {
    server: {
        baseDir: 'app'
    }
};

var path = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        libs: 'dist/libs',
        css: 'dist/css/',
        img: 'dist/img/'
    },
    app: {
        html: 'app/*.html',
        js: 'app/js/*.js',
        libs: 'app/libs',
        scss: 'app/sass/style.scss',
        css: 'app/css/*.css',
        img: 'app/img/**/*.*'
    },
    watch: {
        html: 'app/*.html',
        js: 'app/js/*.js',
        scss: 'app/sass/*.scss',
        css: 'app/css/*.css',
        img: 'app/img/**/*.*'
    },
    clean: 'dist/'
};

var gulp = require("gulp"),
    browserSync = require('browser-sync').create(), // сервер для работы и автоматического обновления страниц
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg
    pngquant = require('imagemin-pngquant'), // плагин для сжатия png
    gcmq           = require('gulp-group-css-media-queries'),
    del = require('del'); // плагин для удаления файлов и каталогов


/* задачи */

// запуск сервера +
gulp.task('browserSync', function(done) {
    browserSync.init(config);
    browserSync.watch('app/').on('change', browserSync.reload);
    done();
});

// сбор html
gulp.task('html:build', function(done) {
    gulp.src(path.app.html) // выбор всех html файлов по указанному пути
        .pipe(gulp.dest(path.dist.html)) // выкладывание готовых файлов
        .pipe(browserSync.reload({ stream: true })); // перезагрузка сервера
    done();
});

// сбор стилей
gulp.task('scss:build', function(done) {
    gulp.src(path.app.scss) // получим main.scss
        .pipe(sass({
            outputStyle: 'compact'
        }).on('error', sass.logError)) // scss -> css
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        // .pipe(autoprefixer(/*{тут был автопрефиксер-лист(галп-автопрефиксер я поменял его на просто автопрефиксер)}*/)) // добавим префиксы
        .pipe(cleanCSS({
            level: 2
        }, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        })) // минимизируем CSS
        .pipe(gcmq())
        .pipe(gulp.dest(path.dist.css)) // выгружаем в dist
        .pipe(gulp.dest(path.app.css)) // выгружаем в app
        .pipe(browserSync.reload({ stream: true })); // перезагрузим сервер
    done();
});

gulp.task('css:build', function(done) {
    gulp.src(path.app.css)
        .pipe(gulp.dest(path.dist.css)); // Переносим скрипты в продакшен
    done();
});

// сбор js
gulp.task('js:build', function(done) {
    gulp.src(path.app.js) // получим файл main.js
        .pipe(uglify()) // минимизируем js
        .pipe(gulp.dest(path.dist.js)) // положим готовый файл
        .pipe(browserSync.reload({ stream: true })); // перезагрузим сервер
    done();
});

gulp.task('libs:build', function(done) {
    gulp.src(path.app.libs)
        .pipe(gulp.dest(path.dist.libs)); // Переносим скрипты в продакшен
    done();
});

// перенос шрифтов
// gulp.task('fonts:build', function(done) {
//     gulp.src(path.app.fonts)
//         .pipe(gulp.dest(path.dist.fonts));
//     done();
// });

// обработка картинок
gulp.task('image:build', function(done) {
    gulp.src(path.app.img) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
            imagemin.gifsicle({ interlaced: true }),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ])))
        .pipe(gulp.dest(path.dist.img)); // выгрузка готовых файлов
    done();
});

// удаление каталога dist
gulp.task('clean:build', function(done) {
    del.sync(path.clean);
    done();
});

// очистка кэша
gulp.task('cache:clear', function(done) {
    cache.clearAll();
    done();
});

// сборка
gulp.task('build', gulp.series('clean:build', 'html:build', 'scss:build', 'css:build', 'js:build', 'libs:build', 'image:build', function(done) {
    done();
}));

// запуск задач при изменении файлов

gulp.task('watch', function() {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.scss, gulp.series('scss:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
});

// задача по умолчанию
gulp.task('default', gulp.series('clean:build', 'build', gulp.parallel('browserSync', 'watch')));
