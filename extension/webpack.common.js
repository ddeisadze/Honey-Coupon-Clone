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
        product_page_content: path.resolve("./src/contentScript/amazon/productPage/amazonProductPage.tsx"),
        checkout_page_content: path.resolve("./src/contentScript/amazon/checkout/checkoutPage.tsx"),
        test_general: path.resolve("./src/contentScript/test.tsx"),
        // test_product_page: path.resolve("./src/contentScript/test.tsx"),
        test_checkout_page: path.resolve("./src/contentScript/test_checkout_page.tsx"),
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
            title: 'Test Content Script',
            filename: 'test_product_page.html',
            chunks: ['product_page_content', 'test_general'],
        }),

        new HTMLWebpackPlugin({
            title: 'Test Content Script',
            filename: 'test_checkout_page.html',
            chunks: ['checkout_page_content', 'test_general', 'test_checkout_page'],
        }),

    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],

    },
    output: {
        filename: "[name].js",
        // publicPath: '/'

    },
    optimization: {
        splitChunks: {
            chunks(chunk) {
                if (chunk.name && chunk.name.includes('content')) {
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