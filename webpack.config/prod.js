const path = require('path');
const {merge} = require('webpack-merge');
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
    // devtool: 'source-map',
    devtool: false,
    entry: {
        main: [
            './src/index.js'
        ],
    },
    output: {
        clean: true, // 在生成文件前清空output目录，webpack 5.20.0+ 新增
        path: path.join(config.root, 'dist'),  // 所有输出文件的目标路径，必须是绝对路径
        filename: 'js/[name].[chunkhash:8].bundle.js',
        chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
        assetModuleFilename: 'images/[hash][ext][query]',
        publicPath: '/',
        // hashFunction: 'xxhash64',
    },
    optimization: {
        // 设置Optimization.minimizer会覆盖webpack默认的js压缩，因此需要指定js压缩插件
        minimizer: [
            // js压缩
            new TerserJSPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 6,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending further investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 6,
                        comments: false,
                    },
                }
            }),
            // css压缩
            new CssMinimizerPlugin(),
        ],
        chunkIds: 'named',
        moduleIds: 'deterministic',
        runtimeChunk: 'single',  // 将webpack运行时生成代码打包，为运行时代码创建一个额外的 chunk，减少 entry chunk 体积
        // 分割代码块
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    priority: -10,
                },
                react: {
                    name: 'react',
                    test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
                    chunks: 'all',
                    priority: 20,
                },
                player: {
                    name: 'player',
                    test: /[\\/]node_modules[\\/]xgplayer[\\/]/,
                    chunks: 'all',
                    priority: 15,
                },
                virtualized: {
                    name: 'virtualized',
                    test: /[\\/]node_modules[\\/](react-window|react-virtualized-auto-sizer)[\\/]/,
                    chunks: 'all',
                    priority: 10,
                },
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2,
                    priority: 1,
                    reuseExistingChunk: true // 如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
                },
            }
        },
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
            },
        }),

        // 进一步压缩lodash
        new LodashModuleReplacementPlugin(),

        // 提取css，路径相对于输出文件所在的位置
        new MiniCssExtractPlugin({
            // contenthash 将根据资源内容创建出唯一hash，文件内容不变，hash就不变
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css',
            ignoreOrder: true, // Conflicting order
        }),
        // 开启 gzip，如果服务端没有开启gzip，或者没有开启静态gzip，前端没必要gzip压缩
        new CompressionPlugin({
            algorithm: 'gzip', // 使用gzip压缩
            test: /\.(js|html|css)$/,
            // filename: '[path][base].gz', // 压缩后的文件名(保持原文件名，后缀加.gz)
            threshold: 10240, // 只处理比这个值大的资源，按字节计算
            minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
        }),

        new BundleAnalyzerPlugin({
            analyzerMode: process.env.ANALYZER_MODE || 'disabled',
        }),
    ],
})
