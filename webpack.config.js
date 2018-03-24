const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const NodemonPlugin = require('nodemon-webpack-plugin');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: {
        backend: './src/server.js',
        // frontend: './src/public/javascripts/game.js'
    },
    target: 'node',
    node: {
        __dirname: true
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    externals: nodeModules,
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less)$/),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        new NodemonPlugin({
            /// Arguments to pass to the script being restarted
            args: ['demo'],

            // What to watch
            watch: path.resolve('./build'),

            // Files to ignore
            ignore: ['*.js.map'],

            // Detailed log
            verbose: true,
        })
    ],
    devtool: 'sourcemap'
};