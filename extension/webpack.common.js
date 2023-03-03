const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const HtmlPlugin = require('html-webpack-plugin');

const path = require("path");
const ZipPlugin = require('zip-webpack-plugin');

const fileLoader = require('file-loader');
const svgUrlLoader = require('svg-url-loader');


module.exports = {
    entry: {
        popup: path.resolve("./src/popup/toolBarPopUp.tsx"),
        product_page_content: path.resolve("./src/contentScript/amazon/productPage/amazonProductPage.tsx"),
        checkout_page_content: path.resolve("./src/contentScript/amazon/checkout/checkoutPage.tsx"),
        test_general: path.resolve("./src/contentScript/test_index/test_general.tsx"),
        test_price_history: path.resolve("./src/contentScript/test_index/test_price_history.tsx"),
        test_checkout_page: path.resolve("./src/contentScript/test_index/test_checkout_page.tsx"),
        options: path.resolve('./src/options/index.tsx'),
        background: path.resolve('./src/background/backgroundIndex.tsx'),
        loginPage: path.resolve('./src/login/loginPopupIndex.tsx')
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
                test: /\.css$/
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

        new HTMLWebpackPlugin({
            title: 'Test Price History',
            filename: 'test_price_history.html',
            chunks: ['test_price_history'],
        }),

        new HTMLWebpackPlugin({
            title: 'Unboxr | Login',
            filename: 'login.html',
            chunks: ['loginPage'],
        }),

        new ZipPlugin({
            path: 'dist/',
            // OPTIONAL: defaults to the Webpack output filename (above) or,
            // if not present, the basename of the path
            filename: 'unboxr.zip',

            // OPTIONAL: defaults to 'zip'
            // the file extension to use instead of 'zip'
            extension: 'ext'
        }),

    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],

    },
    output: {
        filename: "[name].js",
        // publicPath: '/'

    },
    experiments: {
        topLevelAwait: true
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