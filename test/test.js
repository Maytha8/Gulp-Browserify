const assert = require('assert');
const es = require('event-stream');
const { Readable } = require('stream');
const File = require('vinyl');
const gulpBrowserify = require('..');

describe('gulp-browserify', function () {
    it('should work in buffer mode', function () {

        const input = new File({
            contents: Buffer.from(`
                const _ = require('lodash/array');
                console.log(_.join(['Hello, ', 'world!']));
            `),
        });

        const plugin = gulpBrowserify()

        plugin.write(input);

        plugin.once('data', function (output) {
            assert(output.isVinyl(), 'output should be a Vinyl object');
            assert(output.isBuffer(), 'output content should be a Buffer');
        });

    });
    it('should work in streaming mode', function () {

        const input = new File({
            contents: Readable.from(`
            const _ = require('lodash/array');
            console.log(_.join(['Hello, ', 'world!']));
        `),
        });

        const plugin = gulpBrowserify();

        plugin.write(input);

        plugin.once('data', function (output) {
            assert(output.isStream(), 'output content should be a Stream');
        });

    });
});
