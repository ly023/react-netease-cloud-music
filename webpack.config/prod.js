const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const cssnano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = require('./config');
const baseConfig = require('./base');

module.exports = merge(baseConfig, {
    mode: 'production',
    entry: {
        main: [
            '@babel/polyfill',
            './src/index.js'
        ],
        vendor: ['react', 'lodash']
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/](react|react-dom|redux|rect-redux|react-router)[\\/]/,
                    name: "vendor",
                }
            }
        }
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             default: false,
    //             styles: {
    //                 name: 'styles',
    //                 test: /\.(css|scss)$/,
    //                 chunks: 'all',
    //                 priority: 0,
    //                 minChunks: 2,
    //                 enforce: true,
    //             },
    //             vendors: {
    //                 chunks: 'initial',
    //                 name: 'vendors',
    //                 test: /[\\/]node_modules[\\/]/,
    //                 priority: -10,
    //                 enforce: true,
    //             },
    //             vendorsAsync: {
    //                 chunks: 'async',
    //                 name: true,
    //                 test: /[\\/]node_modules[\\/]/,
    //                 priority: -20,
    //                 minSize: 30000,
    //                 reuseExistingChunk: true,
    //             },
    //             vendorsAsyncCommon: {
    //                 chunks: 'async',
    //                 name: true,
    //                 minChunks: 2,
    //                 priority: -30,
    //                 minSize: 30000,
    //                 reuseExistingChunk: true,
    //             },
    //         }
    //     },
    //     runtimeChunk: {
    //         name: 'runtimeChunk',
    //     }
    // },
    output: {
        path: path.join(config.root, 'dist'),  // 所有输出文件的目标路径，必须是绝对路径
        filename: 'js/[name].[chunkhash:8].js', // 出口文件名
        publicPath: '/'
    },
    devtool: 'cheap-module-source-map',
    plugins: [
        // 指定生产环境
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        // 提取css，路径相对于输出文件所在的位置
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
        }),
        // 压缩js文件
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                compress: false,
                ecma: 6,
                mangle: true
            },
            sourceMap: true
        }),
        // 压缩css文件
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssnano,
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),
        // 开启 gzip
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|html|css)$/,
            threshold: 10240, // 只处理比这个值大的资源。按字节计算
            minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
        }),
        // 清除dist文件夹
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['dist'],
        }),
        // 为组件和模块分配ID，将最短ID分配给频率高的模块
        new webpack.optimize.OccurrenceOrderPlugin(),
    ]
})
