const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 可视化资源分析

const config = require('./config');
const isDevelopment = process.env.NODE_ENV === 'development';

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: config.root, // 绝对路径，webpack 编译时的基础目录，entry 会相对于此目录查找
    module: { // 配置loader
        // 如果项目中使用jquery，jquery并没有采用模块化标准，让webpack忽略它
        // noParse: /jquery/,
        rules: [
            {
                // 编译 js、jsx
                // 如果项目源码中没有 jsx 文件就不要写 /\.jsx?$/，提升正则表达式性能
                // test: /\.jsx?$/,
                test: /\.js$/,
                // enforce: 'pre', // ESLint 优先级高于其他 JS 相关的 loader
                loader: isDevelopment ? [
                    'babel-loader',
                    'eslint-loader',
                ] : [
                    'babel-loader',
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    isDevelopment ? {
                        loader: 'style-loader',
                    } : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.scss$/,
                exclude: [/node_modules/],
                use: [
                    isDevelopment ? {
                        loader: 'style-loader',
                    } : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[folder]-[local]-[hash:base64:5]',
                            },
                        }
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: false,
                            },
                        },
                    },
                    {
                        loader: 'sass-resources-loader', // 实现全局scss变量
                        options: {
                            resources: [resolve('src/style/variable.scss')]
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|ttf|eot)$/i,
                loader: 'url-loader',
                options: {
                    esModule: false, // 启用CommonJS模块语法
                    outputPath: 'images/',  // 路径要与output.publicPath结合
                    limit: 8192, // 小于8k转成base64嵌入到js或css中，减少加载次数
                    name: '[hash:8]-[name].[ext]?[hash:8]',
                }
            }
        ]
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
            actions: resolve('src/actions'),
            assets: resolve('src/assets'),
            api: resolve('src/api'),
            components: resolve('src/components'),
            config: resolve('src/config'),
            constants: resolve('src/constants'),
            hoc: resolve('src/hoc'),
            reducers: resolve('src/reducers'),
            router: resolve('src/router'),
            sagas: resolve('src/sagas'),
            services: resolve('src/services'),
            store: resolve('src/store'),
            style: resolve('src/style'),
            utils: resolve('src/utils'),
            pages: resolve('src/pages'),
        },
        // 省略后缀名
        // resolve.extensions 列表要尽可能的小，不要把项目中不可能存在的情况写到后缀尝试列表中
        // 频率出现最高的文件后缀要优先放在最前面，以做到尽快的退出寻找过程
        extensions: ['.js', '.json'],
    },
    plugins: isDevelopment ? [
        new BundleAnalyzerPlugin({
            // analyzerMode: 'server',
            analyzerMode: 'disabled',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8888,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: true, // 在默认浏览器中自动打开报告
            generateStatsFile: false, // 是否生成stats.json文件
            statsFilename: 'stats.json',
            logLevel: 'info'
        }),
    ] : [
        new MiniCssExtractPlugin(),
    ]
};

