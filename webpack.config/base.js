const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // js入口文件自动注入
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
                    {
                        loader: 'thread-loader',
                        options: {
                            poolTimeout: Infinity
                        }
                    },
                    'babel-loader',
                    'eslint-loader',
                ] : [
                    'thread-loader',
                    'babel-loader',
                ],
                // exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
                exclude: /node_modules/
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
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images/',  // 路径要与output.publicPath结合
                            name: '[name].[ext]?[hash:8]'
                        }
                    }
                ]
            },
            {
                test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    outputPath: 'fonts/',
                    name: '[name].[ext]?[hash:8]',
                    prefix: 'font'
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
        new HtmlWebpackPlugin({
            filename: path.join(config.root, 'dist/index.html'),  // 生成的html存放路径，相对于path
            template: path.join(config.root, 'index.html'), // 模板文件
            inject: 'body', // js的script注入到body底部
            favicon: path.join(config.root, 'src/assets/favicon.ico'), // favicon路径
            minify: {    // 压缩HTML文件
                removeComments: true,    // 移除HTML中的注释
                collapseWhitespace: false    // 删除空白符与换行符
            }
        }),

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
        })
    ]
};

