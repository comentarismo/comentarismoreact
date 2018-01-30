const path = require('path')
const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')

const BUILD_DIR = path.resolve(__dirname, '../', 'dist')
const APP_DIR = path.resolve(__dirname, 'app/app')
const PUBLIC_DIR = path.resolve(__dirname, '../', 'public')

var GIT_HASH = require('child_process').
    execSync('git rev-parse --short HEAD').
    toString().
    trim()

console.log(`Building with GIT_HASH: ${GIT_HASH}`)

var DEBUG = !(process.env.NODE_ENV === 'production')
var WEBPACK_PORT = process.env.WEBPACK_PORT || 3001
const PUBLIC_PATH = 'https://www.comentarismo.com/'

var env = {
    NODE_ENV: process.env.NODE_ENV,
    API_BASE_URL: process.env.API_BASE_URL,
}

const VENDOR_LIBS = [
    'react',
    'react-dom',
]

var config = {
    devtool: DEBUG ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    entry: {
        app: APP_DIR,
        // vendor: VENDOR_LIBS
    },
    resolve: {
        extensions: ['.js', '.scss'],
        modules: [
            path.resolve(__dirname, 'app'),
            'node_modules',
            path.join(__dirname, 'vendor/searchkit/theming'),
        ],
        alias: {
            app: APP_DIR,
            public: PUBLIC_DIR,
        },
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: DEBUG ? '[name].js' : '[name].js',
        // publicPath: '/',
    },
    plugins: [
        new ProgressBarPlugin({
                format: '  build [:bar] ' + chalk.green.bold(':percent') +
                ' (:elapsed seconds)',
                clear: false,
            },
        ),
        new ExtractTextPlugin('theme.css', {allChunks: true}),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filname: 'vendor.js',
            minChunks: Infinity,
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: true,
            options: {
                head: {title: '', meta: ''},
                scriptSrcs: {},
                reduxState: {},
                styleSrc: [
                    `//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800`,
                    '//fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,900',
                    '/static/all.min.css',
                ],
                searchCss: {},
            },
        }),
    ],
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/,
                include: __dirname,
            },
            {
                test: /\.(scss|css)$/,
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
            {
                loader: 'json-loader',
                test: /.json$/,
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/images/[hash].[ext]',
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            query: {
                                mozjpeg: {
                                    progressive: true,
                                },
                                gifsicle: {
                                    interlaced: true,
                                },
                                optipng: {
                                    optimizationLevel: 7,
                                },
                            },
                        },
                    },
                ],
            },
        ],
    },
}

if (DEBUG) {
    // config.setup = function (app) {
    //         app.get('/service-worker.js', function (req, res) {
    //             res.set({ 'Content-Type': 'application/javascript; charset=utf-8' });
    //             res.send(fs.readFileSync('build/service-worker.js'));
    //         });
    //     }
    config.entry.dev = [
        `webpack-dev-server/client?http://localhost:${WEBPACK_PORT}`,
        'webpack/hot/only-dev-server',
    ]
    
    config.plugins = config.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
    ])
    config.output.publicPath = `http://localhost:${WEBPACK_PORT}/`
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
        new AssetsPlugin({path: path.join(__dirname, 'dist')}),
        new SWPrecacheWebpackPlugin({
            cacheId: 'comentarismo',
            filename: 'comentarismo-sw-file.js',
            maximumFileSizeToCacheInBytes: 4194304,
            staticFileGlobsIgnorePatterns: [
                /\.json/,
                /\.map/,
                /\.xml/,
                /\.map$/,
                /asset-manifest\.json$/],
            runtimeCaching: [
                {
                    handler: 'networkFirst',
                    urlPattern: /^https:\/\/(www\.)?comentarismo.com$/,
                }],
            // dontCacheBustUrlsMatching: /\.\w{8}\./,
            minify: true,
            navigateFallback: PUBLIC_PATH,
        }),
        new webpack.NamedModulesPlugin(),
        new OfflinePlugin({
            // externals: ['index.html'],
            // AppCache: false,
            caches: {
                main: [
                    'app.js',
                    'manifest.js',
                    'static/all.js',
                ],
                additional: [
                    ':externals:',
                ],
                optional: [
                    ':rest:',
                ],
            },
            // caches: 'all',
            relativePaths: false,
            publicPath: '/',
            ServiceWorker: {
                events: true,
                entry: './pwa/sw-handler.js',
                output: '../dist/sw.js',
                publicPath: '/sw.js',
                navigateFallbackURL: '/',
            },
            AppCache: false,
            //https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache
            // AppCache: {
            //     events: true,
            //     output: '../dist/appcache',
            //     publicPath: '/appcache/',
            // },
            externals: [
                '/',
                'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
            ],
        }),
        // new ManifestPlugin({
        //     output: path.join(__dirname, 'dist'),
        //     fileName: 'asset-manifest.json', // Not to confuse with manifest.json
        //
        // }),
        new InlineManifestWebpackPlugin({
            name: 'webpackManifest',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
            filname: 'manifest.json',
        }),
        // new HtmlWebpackPlugin({
        //     inject: 'body',
        //     filename: 'index.html',
        //     template: '!!raw-loader!app/server/views/index.ejs',
        // minify: {
        // collapseBooleanAttributes: true,
        // removeComments: true,
        // collapseWhitespace: true,
        // },
        // }),
    ])
}

module.exports = config
