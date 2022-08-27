const extSourcemap = require('externalise-sourcemap').default;
const browserify = require('browserify');
const applySourceMap = require('vinyl-sourcemaps-apply');
const es = require('event-stream');
const {Transform, PassThrough} = require('node:stream');

function through(transform) {
    return new Transform({
        transform,
        objectMode: true,
    });
}

function gulpBrowserify(opts) {
    return through(async function(file, enc, cb) {
        let browserifyObj;
        // Check if the input is a stream or not
        if (file.isStream()) { // The input is a stream
            // Run stream through Browserify
            browserifyObj = browserify(file.contents, Object.assign({ // Merge user options with debug option
                debug: Boolean(file.sourceMap), // Check if source maps are needed
            }, opts));
        } else { // The input is not a stream (presumably a buffer)
            // Convert to a stream and run through Browserify
            browserifyObj = browserify(es.readArray([file.contents]), Object.assign({ // Merge user options with debug option
                debug: Boolean(file.sourceMap), // Check if source maps are needed
            }, opts));
        }
        // Wait for a buffer output from Browserify
        // See https://github.com/browserify/browserify/blob/master/readme.markdown#bbundlecb
        const output = await new Promise(function(resolve, reject) {
            const d = [];
            const b = new PassThrough();
            b.on('data', (c) => {
                d.push(c);
            });
            b.on('end', function() {
                resolve(Buffer.concat(d));
            });
            b.on('error', function(err) {
                reject(err);
            });
            browserifyObj.bundle().pipe(b);
            // .pipe(es.wait(function(err, data) {
            //     console.log('BROWSERIFY', err, data);
            //     if (err) {
            //         reject(err);
            //     } else {
            //         resolve(data);
            //     };
            // }));
        }).catch(function(err) {
            cb(err);
        });

        // Check if source maps are needed
        if (file.sourceMap) {
            // Extract source map
            const smResult = extSourcemap(output, {sourcemapOnly: false});
            // Change output
            output = smResult.code;
            // Apply sourcemap
            applySourceMap(file, smResult);
        }

        // Change file.contents
        if (file.isStream()) {
            file.contents = es.readArray([output]);
        } else {
            file.contents = Buffer.from(output);
        }

        // Finish
        cb(null, file);
    });
}

module.exports = exports.default = gulpBrowserify;
