const through = require('through2');
const exorcist = require('exorcist');
const browserify = require('browserify');
const applySourceMap = require('vinyl-sourcemaps-apply');
const { Readable, PassThrough } = require('node:stream');

function gulpBrowserify(opts) {
    return through.obj(async function (file, _, cb) {
        // Check if the input is a stream or not
        if (file.isStream()) { // The input is a stream
            // Run stream through Browserify
            const b = browserify(file.contents, Object.assign({ // Merge user options with debug option
                debug: Boolean(file.sourceMap) // Check if source maps are needed
            }, opts));
            // Ouput a stream
            file.contents = b.bundle();
        } else { // The input is not a stream (presumably a buffer)
            // Convert to a stream and run through Browserify
            const b = browserify(Readable.from(file.contents), Object.assign({ // Merge user options with debug option
                debug: Boolean(file.sourceMap) // Check if source maps are needed
            }, opts));
            // Wait for a buffer output from Browserify
            // See https://github.com/browserify/browserify/blob/master/readme.markdown#bbundlecb
            file.contents = await new Promise(function (resolve, reject) {
                b.bundle(function (err, buffer) {
                    if (err) reject(err); else resolve(buffer);
                });
            });
        }

        // Check if source maps are needed
        if (file.sourceMap) {
            // Wait for source map to be added instead of moving on
            await new Promise(function (resolve) {
                // Construct basic PassThrough transform stream
                const smStream = new PassThrough();
                const buf = [];
                // Add any data recieved to our buf array
                smStream.on('data', async function (chunk) {
                    buf.push(chunk);
                });
                // When finished:
                smStream.on('end', async function () {
                    // Join all the buffers together and convert to string
                    const map = Buffer.concat(buf).toString('ascii');
                    // Add source map to chain
                    applySourceMap(file, map);
                    // Resolve the promise
                    resolve();
                });
                // Run Exorcist and seperate source map
                file.contents.pipe(exorcist(smStream, file.basename + '.map'));
            });
        }

        // Finish
        this.push(file);
        cb();
    })
}

module.exports = exports.default = gulpBrowserify;