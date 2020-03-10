const argv = require('yargs').argv;
const fetchPolyfill = require('node-fetch');
const fs = require('fs');
const gulp = require('gulp');
const gulpAppendPrepend = require('gulp-append-prepend');
const gulpInjectVersion = require('gulp-inject-version');
const gulpRemoveCode = require('gulp-remove-code');

const { __fetchProjectData } = require('./src/');

gulp.task('build', function build() {
  return gulp
    .src('./src/index.js')
    .pipe(
      gulpInjectVersion({
        append: '',
        package_file: 'package.json',
        prepend: '',
        replace: '%%PACKAGE_VERSION%%',
        version_property: 'version',
      })
    )
    .pipe(gulpRemoveCode({ BUILD: true }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('fetch', async () => {
  const { sdkKey } = argv;
  if (!sdkKey) {
    console.log(
      '[WARNING] No SDK Key was provided. Specify one via "npm run build --sdkKey=a1b2c3d4e5f6"'
    );
    return;
  }
  const response = await __fetchProjectData(sdkKey, {
    fetchPolyfill,
  });
  let fileContents = `// Last snapshot: ${new Date()}\n`;
  fileContents += `const OPTIMIZELY_DATA = ${JSON.stringify(response)};`;
  console.log('[SUCCESS] Datafile fetched');
  fs.writeFile('./dist/data.js', fileContents, function(err) {
    if (err) return console.error('[OPTIMIZELY] Write failure', err);
    gulp
      .src('./dist/index.js')
      .pipe(gulpAppendPrepend.prependFile('./dist/data.js'))
      .pipe(gulp.dest('./dist'));
  });
});
