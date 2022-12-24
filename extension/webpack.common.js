const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: {
        popup : path.resolve("./src/popup/popup.tsx"),
        background: path.resolve("./src/background/background.ts"),
        content: path.resolve("./src/contentScript/contentScript.tsx"),
    },
    module: {
        rules:[
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
            ],
          }),

          new HTMLWebpackPlugin({
            title: 'Unboxr',
            filename: 'popup.html',
            chunks: ['popup'],
          })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "[name].js",
    },
    optimization: {
        splitChunks:{
            chunks(chunk){
                return chunk.name !== 'contentScript';
            }
        }
    }
}