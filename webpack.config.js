var path = require('path')
var webpack = require('webpack')
var AssetsPlugin = require('assets-webpack-plugin')

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
        modules: [
            path.resolve(__dirname, 'app'),
            'node_modules',
        ],
    },
    output: {
        path: path.join(__dirname, 'vendor'),
        filename: DEBUG ? '[name].js' : '[name].js',
    },
    plugins: [
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
        }),
        new webpack.HashedModuleIdsPlugin(),
        new AssetsPlugin({path: path.join(__dirname, 'vendor')}),
    ])
}

module.exports = config
