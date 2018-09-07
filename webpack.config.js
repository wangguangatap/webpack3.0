const path = require('path');
const Webpack = require('webpack');
const glob = require('glob');
const uglifyPlugin = require('uglifyjs-webpack-plugin');   //js压缩，自带
const HtmlWebpackPlugin = require('html-webpack-plugin');   //html处理
const ExtractTextPlugin = require('extract-text-webpack-plugin');  //单独打包css
const PurifyCssPlugin = require('purifycss-webpack');   //消除失效css


//封装HtmlPlugin插件
const HtmlPluginFunction = (name)=>({
    favicon: "./src/source/favicon.ico",
    title: name,
    filename: `${name}.html`,
    template: `./src/view/${name}.html`,
    inject: true,
    hash: true,
    chunks: ['common',name], 
    minify: {
        removeAttributeQuotes: true // 移除属性的引号
    }
});

//publicPath参数
const webSite = {
    publicPath: 'http://127.0.0.1',
    port: 8089
};

module.exports = {
    entry: {
        common: "./src/page/common/common.js",
        index: "./src/page/index/index.js",
        login: "./src/page/login/login.js",
        jquery: "jquery"
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: "js/[name].js",
        publicPath: `${webSite.publicPath}:${webSite.port}`
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                minimize: false    //css压缩
                            }
                        },
                        "postcss-loader"
                    ]
                }) 
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    outputPath: '/images',
                    name: '[name][hash:8].[ext]'
                }
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {loader: 'css-loader'},
                        {loader: 'less-loader'}
                    ]
                }) 
            },
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader',
                },
                exclude: /node_modules/ 
            }

        ]
    },
    plugins: [
        //new uglifyPlugin(),    //js压缩

        //引入第三方扩展
        /** 
        new Webpack.ProvidePlugin({
            $: "jquery"
        }),
        **/

        new HtmlWebpackPlugin(HtmlPluginFunction('index')),
        new HtmlWebpackPlugin(HtmlPluginFunction('login')),
        new ExtractTextPlugin("css/[name].css"),
        new PurifyCssPlugin({
            paths: glob.sync(path.resolve(__dirname,'src/*.html'))
        }),
        new Webpack.optimize.CommonsChunkPlugin({
            name: ["jquery","common"],
            filename: "js/[name].js",
            minChunks: 2
        })
    ],

    devServer: {
        contentBase: path.resolve(__dirname,'dist'),
        host: "127.0.0.1",
        port: "8089",
        compress: true
    },

    //devtool: 'source-map',

    watchOptions: {
        poll: 1000,
        aggregeateTimeout: 500,
        ignored: /node_modules/
    }
}