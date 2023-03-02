const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");

const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
    mode: "development",
    devtool: 'cheap-module-source-map',
    devServer: {
        historyApiFallback: true,
        directory: path.join(__dirname, 'dist'),
        overlay: false,
        compress: true,
        hot: true,
        port: 8000,
        static: {
            serveIndex: true
        }
    },
    plugins: [
        new Dotenv({
            path: './dev.env'
        }),
    ]
});