const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    mode: 'production',
    entry: {
        app: "./src/index.js"
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        open: true
    },
    module: {
        rules: [
            {
                test:/\.scss/,
                loader:'style-loader!css-loader!sass-loader?outputStyle=expanded'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
                
            },
            {
                test:/\.(png|jpg|woff|woff2|svg|ttf|eot)$/,
                use:'url-loader?limit=8192'
            },
            {
                test: /\.js$/,
                use: "babel-loader?cacheDirectory=true",
                include: path.join(__dirname, 'src')
            }

        ]
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: "Output Management",
            template: "./src/index.html"
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]

}