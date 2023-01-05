const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: {
        popup: path.resolve("./src/popdown/toolBarPopUp.tsx"),
        background: path.resolve("./src/background/background.ts"),
        content: path.resolve("./src/contentScript/amazon/amazonIndex.tsx"), 
        test: path.resolve("./src/contentScript/test.tsx"),
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
            filename: 'test.html',
            chunks: ['content'],
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