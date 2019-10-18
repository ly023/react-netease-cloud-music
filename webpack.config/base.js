const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 可视化资源分析

const config = require('./config');
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    context: config.root, // 绝对路径，webpack 编译时的基础目录，entry 会相对于此目录查找
    module: { // 配置loader
        rules: [
            {
                test: /\.jsx?$/,
                // enforce: 'pre', // ESLint 优先级高于其他 JS 相关的 loader
                loader: isDevelopment ? [
                    'babel-loader',
                    'eslint-loader',
                ] : [
                    'babel-loader',
                ],
                // exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.scss$/,
                exclude: [/node_modules/],
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[folder]-[local]-[hash:base64:5]',
                            },
                        }
                    },
                    'postcss-loader',
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader', // 实现全局scss变量
                        options: {
                            resources: [
                                path.resolve(config.root, 'src/style/variable.scss')
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'url-loader',
                options: {
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
            actions: path.join(config.root, 'src/actions'),
            assets: path.join(config.root, 'src/assets'),
            api: path.join(config.root, 'src/api'),
            components: path.join(config.root, 'src/components'),
            config: path.join(config.root, 'src/config'),
            constants: path.join(config.root, 'src/constants'),
            reducers: path.join(config.root, 'src/reducers'),
            router: path.join(config.root, 'src/router'),
            sagas: path.join(config.root, 'src/sagas'),
            services: path.join(config.root, 'src/services'),
            store: path.join(config.root, 'src/store'),
            style: path.join(config.root, 'src/style'),
            utils: path.join(config.root, 'src/utils'),
            pages: path.join(config.root, 'src/pages'),
        },
        extensions: ['.js', '.json', '.jsx'], // 省略后缀名
    },
    plugins: [
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
    ]
};

