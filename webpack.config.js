const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: ['babel-polyfill','./source/js/index.js'],

    output:{
        path: path.resolve(__dirname,'docs'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './docs'
    },
    plugins: [
        new HtmlWebpackPlugin ({
            filename: 'index.html',
            template: './source/index.html'
        })
    ],
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          }
        ]
      }
    
};


    