const ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: {
        popup: "./src/index.jsx",
        background: "./background.jsx",
        content: "./content.jsx"
    },
  output: {
    path: __dirname + '/public',
    filename: "[name]-bundle.js",
    publicPath: '/public/'
  },
  module: {
    loaders: [
      {
        test: /\.js|.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css-loader!sass-loader')
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'app.css', allChunks: true }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
