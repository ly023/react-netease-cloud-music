const webpack = require('webpack');
const path = require('path');
const {merge} = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // js入口文件自动注入

const apiMocker = require('mocker-api');

const config = require('./config');
const baseConfig = require('./base');

module.exports = merge(baseConfig, {
    mode: 'development',
    entry: {
        main: [
            'react-hot-loader/patch', // Make sure react-hot-loader is required before react and react-dom
            '@babel/polyfill',
            './src/index.js' // 入口文件路径
        ]
    },
    output: {
        path: path.join(config.root, 'dist'),  // 所有输出文件的目标路径，必须是绝对路径
        filename: '[name].[hash:8].bundle.js',  // 列在entry中，打包后输出的文件的名称
        chunkFilename: '[name].[chunkhash:8].chunk.js', // 未列在entry中，却又需要被打包出来的文件的名称（通常是要懒加载的文件）
        publicPath: '/'
    },
    devServer: {
        hot: true,
        port: config.port,
        historyApiFallback: true,
        before(app) {
            apiMocker(app, path.resolve('src/mock/index.js'))
        },
        proxy: {
            '/api': {
                target: 'http://localhost:' + config.proxyPort,
                pathRewrite: {'^/api': ''},
                changeOrigin: true,     // target是域名的话，需要这个参数，
                secure: false,          // 设置支持https协议的代理
            },
        }
    },
    watchOptions : {
        ignored : /node_modules/, // 不监听node_modules目录下的文件
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.join(config.root, 'dist/index.html'),  // 生成的html存放路径，相对于path
            template: path.join(config.root, 'index.html'), // 模板文件
            inject: 'body', // js的script注入到body底部
            favicon: path.join(config.root, 'src/assets/favicon.ico'), // favicon路径
        }),

        // 热替换
        new webpack.HotModuleReplacementPlugin(),

        // 在热加载时直接返回更新文件名，而不是文件的id。
        new webpack.NamedModulesPlugin(),

    ]
});
