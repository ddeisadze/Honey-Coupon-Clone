const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const HtmlPlugin = require('html-webpack-plugin');

const path = require("path");
const Dotenv = require('dotenv-webpack');

const fileLoader = require('file-loader');
const svgUrlLoader = require('svg-url-loader');


module.exports = {
    entry: {
        popup: path.resolve("./src/popup/toolBarPopUp.tsx"),
        content1: path.resolve("./src/contentScript/amazon/amazonIndex.tsx"), 
        content: path.resolve("./src/contentScript/amazon/checkout/checkoutPage.tsx"),
        test: path.resolve("./src/contentScript/test.tsx"),
        options: path.resolve('./src/options/index.tsx'),
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                test: /\.tsx$/,
                exclude: /node_modules/
            },
            {
                use: ["style-loader", "css-loader"],
                test: /\.css$/,
                exclude: /node_modules/
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
              },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve('manifest.json'), to: path.resolve('dist') },
                { from: 'images/', to: path.resolve('dist/images') },
                { from: path.resolve('src/assets/'), to: path.resolve('dist/assets') }
            ],
        }),
        new Dotenv(),

        ...getHtmlPlugins([
            'popup',
            'options',
        ])
        ,

        new HTMLWebpackPlugin({
            title: 'Test Contet Script',
            filename: 'test.html',
            chunks: ['content', 'content1'],
        }),

    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
        
    },
    output: {
        filename: "[name].js",
        publicPath: '/svg/'

    },
    optimization: {
        splitChunks: {
            chunks(chunk) {
                if(chunk.name && chunk.name.includes('content')){
                    return false;
                }
                
                return true;
            }
        }
    }
}

function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'Unboxr',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}