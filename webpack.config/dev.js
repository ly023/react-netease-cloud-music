const path = require('path');
const {merge} = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // js入口文件自动注入
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const openBrowser = require('react-dev-utils/openBrowser');

const apiMocker = require('mocker-api');

const config = require('./config');
const baseConfig = require('./base');

module.exports = merge(baseConfig, {
    mode: 'development',
    entry: {
        main: [
            './src/index.js' // 入口文件路径
        ]
    },
    output: {
        path: path.join(config.root, 'dist'),  // 所有输出文件的目标路径，必须是绝对路径
        filename: '[name].[hash:8].bundle.js',  // 列在entry中，打包后输出的文件的名称
        chunkFilename: '[name].[chunkhash:8].chunk.js', // 未列在entry中，却又需要被打包出来的文件的名称（通常是要懒加载的文件）
        publicPath: '/',
    },
    // cache: {
    //     type: 'filesystem', // 使用文件缓存
    // cacheDirectory 默认路径是 node_modules/.cache/webpack
    // cacheDirectory: path.resolve(__dirname, './temp_cache') // 本地目录
    // },
    devServer: {
        client: {
            overlay: false, // https://webpack.docschina.org/configuration/dev-server/#overlay
        },
        hot: true,
        port: config.port,
        historyApiFallback: true,
        onBeforeSetupMiddleware: function ({app}) {
            apiMocker(app, path.resolve('src/mock/index.js'))
        },
        proxy: {
            '/base': {
                target: 'http://localhost:' + config.proxyPort,
                pathRewrite: {'^/base': ''},
                changeOrigin: true,     // target是域名的话，需要这个参数，
                secure: false,          // 设置支持https协议的代理
            },
        },
        onAfterSetupMiddleware: function () {
            openBrowser && openBrowser('http://localhost:' + config.port);
        },
    },
    watchOptions: {
        ignored: /node_modules/, // 不监听node_modules目录下的文件
    },
    plugins: [
        new ESLintPlugin({
            // extensions: ['ts', 'tsx'],
            // emitWarning: true,
        }),

        new HtmlWebpackPlugin({
            filename: path.join(config.root, 'dist/index.html'),  // 生成的html存放路径，相对于path
            template: path.join(config.root, 'index.html'), // 模板文件
            inject: 'body', // js的script注入到body底部
            favicon: path.join(config.root, 'src/assets/favicon.ico'), // favicon路径
        }),

        new ReactRefreshWebpackPlugin(),
    ]
});
