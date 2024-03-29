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
        filename: '[name].[chunkhash:8].bundle.js',  // 对应 entry 里面的输入文件经webpack打包后输出文件的文件名
        chunkFilename: '[name].[chunkhash:8].chunk.js', // 未列在entry中，却又需要被打包出来的文件的名称（通常是要懒加载的文件）
        publicPath: '/',
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        client: {
            overlay: false, // https://webpack.docschina.org/configuration/dev-server/#overlay
        },
        hot: true,
        port: config.port,
        historyApiFallback: true,
        proxy: [
            {
                context: ['/base'],
                target: 'http://localhost:5023',  // 反向代理的目标服务，这里是本地跑的另一个接口地址
                pathRewrite: {'^/base': ''},
                changeOrigin: true,     // target是域名的话，需要这个参数，开启后会虚拟一个请求头Origin
                secure: false,          // 设置支持https协议的代理
            },
        ],
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined')
            }

            apiMocker(devServer.app, path.resolve('src/mock/index.js'))

            openBrowser && openBrowser('http://localhost:' + config.port);

            return middlewares;
        },
        // proxy: { // webpack-dev-server反向代理，基于Node代理中间件http-proxy-middleware实现
        //     '/base': {
        //         target: 'http://localhost:5023',  // 反向代理的目标服务，这里是本地跑的另一个接口地址
        //         pathRewrite: {'^/base': ''},
        //         changeOrigin: true,     // target是域名的话，需要这个参数，开启后会虚拟一个请求头Origin
        //         secure: false,          // 设置支持https协议的代理
        //     },
        // },
        // onBeforeSetupMiddleware: function ({app}) {
        //     apiMocker(app, path.resolve('src/mock/index.js'))
        // },
        // onAfterSetupMiddleware: function () {
        //     openBrowser && openBrowser('http://localhost:' + config.port);
        // },
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
