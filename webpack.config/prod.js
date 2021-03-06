const path = require('path');
const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin'); // js入口文件自动注入
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 可视化资源分析

const config = require('./config');
const baseConfig = require('./base');

module.exports = merge(baseConfig, {
    mode: 'production',
    devtool: 'source-map',
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
            new CssMinimizerPlugin(),
        ],
        chunkIds: 'named',
        moduleIds: 'deterministic',
        runtimeChunk: { // 或 runtimeChunk: true,  将webpack运行时生成代码打包
            // name: entrypoint => `runtime-${entrypoint.name}`,
            name: 'manifest'
        },
        // 分割代码块
        splitChunks: {
            maxInitialRequests: 5,
            cacheGroups: {
                polyfill: {
                    test: /[\\/]node_modules[\\/](core-js|raf|@babel|babel)[\\/]/,
                    name: 'polyfill',
                    priority: 2,
                    chunks: 'all',
                    reuseExistingChunk: true,
                },
                dll: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'react',
                    priority: 1,
                    chunks: 'all',
                    reuseExistingChunk: true,
                },
                commons: {
                    name: 'commons',
                    minChunks: 3,
                    chunks: 'all',
                    reuseExistingChunk: true,
                },
            }
        },
    },
    output: {
        path: path.join(config.root, 'dist'),  // 所有输出文件的目标路径，必须是绝对路径
        filename: 'js/[name].[chunkhash:8].bundle.js',
        chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
        publicPath: '/'
    },
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
            // contenthash 将根据资源内容创建出唯一hash，文件内容不变，hash就不变
            filename: 'css/[name].[contenthash:8].css',
        }),
        // 开启 gzip
        new CompressionPlugin({
            test: /\.(js|html|css)$/,
            threshold: 10240, // 只处理比这个值大的资源。按字节计算
            minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
        }),

        new BundleAnalyzerPlugin({
            analyzerMode: process.env.ANALYZER_MODE || 'disabled',
        }),
    ]
})
