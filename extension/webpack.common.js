const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: {
        popup: path.resolve("./src/popup/popup.tsx"),
        background: path.resolve("./src/background/background.ts"),
        content: path.resolve("./src/contentScript/amazonIndex.tsx"),
        test: path.resolve("./src/contentScript/test.tsx"),
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                test: /\.tsx$/,
                exclude: /node_modules/
            }
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

        new HTMLWebpackPlugin({
            title: 'Unboxr',
            filename: 'popup.html',
            chunks: ['popup'],
        }),

        new HTMLWebpackPlugin({
            title: 'Test Contet Script',
            filename: 'content.html',
            chunks: ['test'],
        }),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    output: {
        filename: "[name].js",
    },
    optimization: {
        splitChunks: {
            chunks(chunk) {
                return chunk.name !== 'content';
            }
        }
    }
}