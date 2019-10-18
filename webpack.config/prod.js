const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const cssnano = require('cssnano');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin'); // js入口文件自动注入
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const config = require('./config');
const baseConfig = require('./base');

module.exports = merge(baseConfig, {
    mode: 'production', // webpack v4 指定mode自动配置DefinePlugin
    entry: {
        main: [
            '@babel/polyfill',
            './src/index.js'
        ],
    },
    optimization: {
        // 设置Optimization.minimizer会覆盖webpack默认的js压缩，因此需要指定js压缩插件
        minimizer: [
            // js压缩
            new TerserJSPlugin({
                terserOptions: {},
            }),
            // css压缩
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.css\.*(?!.*map)/g, // 正则表达式,用于匹配需要优化或者压缩的资源名，默认为/\.css$/g
                cssProcessor: cssnano,
                cssProcessorOptions: {
                    safe: true, // 在安全模式下运行cssnano从而避免潜在的不安全转换
                    // autoprefixer: false,
                    autoprefixer: {
                        disable: true, // 禁用掉cssnano对于浏览器前缀的处理
                    },
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true, // 移除注释
                    }
                }
            })
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/](react|react-dom|react-router|redux|rect-redux|redux-saga)[\\/]/,
                    name: "vendor",
                }
            }
        }
    },
    output: {
        path: path.join(config.root, 'dist'),  // 所有输出文件的目标路径，必须是绝对路径
        filename: 'js/[name].[chunkhash:8].bundle.js',
        chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
        publicPath: '/'
    },
    devtool: 'cheap-module-source-map',
    plugins: [
        // 清除dist文件夹
        new CleanWebpackPlugin(),

        new HtmlWebpackPlugin({
            filename: path.join(config.root, 'dist/index.html'),  // 生成的html存放路径，相对于path
            template: path.join(config.root, 'index.html'), // 模板文件
            inject: 'body', // js的script注入到body底部
            favicon: path.join(config.root, 'src/assets/favicon.ico'), // favicon路径
            minify: {    // 压缩HTML文件
                removeComments: true,    // 移除HTML中的注释
                collapseWhitespace: false    // 删除空白符与换行符
            },
        }),

        // 进一步压缩lodash
        new LodashModuleReplacementPlugin(),

        // 提取css，路径相对于输出文件所在的位置
        new MiniCssExtractPlugin({
            // contenthash 将根据资源内容创建出唯一hash，也文件内容不变，hash就不变
            filename: 'css/[name].[contenthash:8].css',
        }),

        // 当vender模块没有变化时，保持module.id稳定（缓存vender）
        new webpack.HashedModuleIdsPlugin(),

        // 开启 gzip
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|html|css)$/,
            threshold: 10240, // 只处理比这个值大的资源。按字节计算
            minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
        }),
    ]
})
