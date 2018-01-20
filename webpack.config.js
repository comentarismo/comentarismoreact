var path = require('path')
var webpack = require('webpack')
var AssetsPlugin = require('assets-webpack-plugin')
var CompressionPlugin = require('compression-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

var GIT_HASH = require('child_process').
    execSync('git rev-parse --short HEAD').
    toString().
    trim()

console.log(`Building with GIT_HASH: ${GIT_HASH}`)

var DEBUG = !(process.env.NODE_ENV === 'production')
var env = {
    NODE_ENV: process.env.NODE_ENV,
    API_BASE_URL: process.env.API_BASE_URL,
}

var config = {
    devtool: DEBUG ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    entry: {
        app: path.resolve(__dirname, 'app/app'),
        
    },
    resolve: {
        extensions: ['.js', '.scss'],
        modules: [
            path.resolve(__dirname, 'app'),
            'node_modules',
            path.join(__dirname, 'vendor/searchkit/theming'),
        ],
    },
    output: {
        path: path.join(__dirname, 'vendor'),
        filename: DEBUG ? '[name].js' : '[name].js',
    },
    plugins: [
        new ExtractTextPlugin('theme.css', {allChunks: true}),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filname: 'vendor.js',
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: __dirname,
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                minimize: true,
                                importLoaders: 2,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: 'sass-loader',
                            options: {sourceMap: true},
                        },
                    ],
                    
                }),
                include: path.join(__dirname,
                    'vendor/searchkit/theming/**/*.scss'),
            },
        ],
    },
}

if (DEBUG) {
    config.entry.dev = [
        'webpack-dev-server/client?http://localhost:3001',
        'webpack/hot/only-dev-server',
    ]
    
    config.plugins = config.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
    ])
    config.output.publicPath = 'http://localhost:3001/static/'
    config.module.loaders[0].query = {
        'env': {
            'development': {
                'presets': ['react-hmre'],
            },
        },
    }
} else {
    config.plugins = config.plugins.concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            output: {
                comments: false,
            },
            sourceMap: false,
            minimize: true,
            exclude: [/\.min\.js$/gi],
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0,
        }),
        new webpack.HashedModuleIdsPlugin(),
        new AssetsPlugin({path: path.join(__dirname, 'vendor')}),
    ])
}

module.exports = config
