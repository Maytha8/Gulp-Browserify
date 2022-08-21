// Type definitions for @maytha8/gulp-browserify
// Project: https://github.com/Maytha8/Gulp-Browserify
// Definitions by: Maytham Alsudany <https://github.com/Maytha8>

/// <reference types="node" />

import { Readable, Transform } from "stream";
import Vinyl from "vinyl";

declare var gulpBrowserify: gulpBrowserify.GulpBrowserify;
export = gulpBrowserify;

declare namespace gulpBrowserify {

    interface GulpBrowserify {
        (opts?: Options): GulpTransform;
    }

    interface GulpTransform extends Transform {
        on(event: 'data', listener: (chunk: Vinyl) => void): this;
        once(event: 'data', listener: (chunk: Vinyl) => void): this;
    }

    /**
     * Options pertaining to a Browserify instance.
     */
    interface Options {
        // String, file object, or array of those types (they may be mixed) specifying entry file(s).
        entries?: InputFile | InputFile[] | undefined;
        // an array which will skip all require() and global parsing for each file in the array.
        // Use this for giant libs like jquery or threejs that don't have any requires or node-style globals but take forever to parse.
        noParse?: string[] | undefined;
        // an array of optional extra extensions for the module lookup machinery to use when the extension has not been specified.
        // By default Browserify considers only .js and .json files in such cases.
        extensions?: string[] | undefined;
        // an array of directories that Browserify searches when looking for modules which are not referenced using relative path.
        // Can be absolute or relative to basedir. Equivalent of setting NODE_PATH environmental variable when calling Browserify command.
        paths?: string[] | undefined;
        // sets the algorithm used to parse out the common paths. Use false to turn this off, otherwise it uses the commondir module.
        commondir?: boolean | undefined;
        // disables converting module ids into numerical indexes. This is useful for preserving the original paths that a bundle was generated with.
        fullPaths?: boolean | undefined;
        // sets the list of built-ins to use, which by default is set in lib/builtins.js in this distribution.
        builtins?: string[] | {[builtinName: string]: string} | boolean | undefined;
        // set if external modules should be bundled. Defaults to true.
        bundleExternal?: boolean | undefined;
        // When true, always insert process, global, __filename, and __dirname without analyzing the AST for faster builds but larger output bundles. Default false.
        insertGlobals?: boolean | undefined;
        // When true, scan all files for process, global, __filename, and __dirname, defining as necessary.
        // With this option npm modules are more likely to work but bundling takes longer. Default true.
        detectGlobals?: boolean | undefined;
        // When true, add a source map inline to the end of the bundle. This makes debugging easier because you can see all the original files if you are in a modern enough browser.
        debug?: boolean | undefined;
        // When a non-empty string, a standalone module is created with that name and a umd wrapper.
        // You can use namespaces in the standalone global export using a . in the string name as a separator, for example 'A.B.C'.
        // The global export will be sanitized and camel cased.
        standalone?: string | undefined;
        // will be passed to insert-module-globals as the opts.vars parameter.
        insertGlobalVars?: insertGlobals.VarsOption | undefined;
        // defaults to 'require' in expose mode but you can use another name.
        externalRequireName?: string | undefined;
    }

}