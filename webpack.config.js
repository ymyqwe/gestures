var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
    entry: APP_DIR + '/index.js',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
    },
    module: {
        loaders : [
            {
                test: /\.js$/,
                include: APP_DIR,
                loader: 'babel-loader'
            },
            {
                test:/\.css$/,
                loader:"css-loader"
            },
            { 
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, 
                loader: 'url-loader?limit=8192'
            },
        ]
    }
}

module.exports = config;