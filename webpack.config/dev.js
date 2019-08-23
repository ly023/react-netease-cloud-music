const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const config = require('./config');
const baseConfig = require('./base');

module.exports = merge(baseConfig, {
    mode: 'development',
    entry: {
        main: [
            '@babel/polyfill',
            'react-hot-loader/patch',
            './src/index.js' // 入口文件路径
        ]
    },
    output: {
        path: path.join(config.root, 'dist'),  // 所有输出文件的目标路径，必须是绝对路径
        filename: '[name].bundle.js',  // 出口文件名
        chunkFilename: '[chunkhash].bundle.js', // 设置按需加载后的chunk名字
        publicPath: '/'
    },
    devServer: {
        hot: true,
        port: config.port,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                pathRewrite: {'^/api': ''},
                changeOrigin: true,     // target是域名的话，需要这个参数，
                secure: false,          // 设置支持https协议的代理
            },
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
});
