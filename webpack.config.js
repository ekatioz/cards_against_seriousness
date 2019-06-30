const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: ["./src/client/ui/CardsAgainst"]
  },
  mode: "development",
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/"
  },
  devtool: "source-map",
  module: {
    rules: [
      { test: /\.(ttf)$/, loader: "url-loader" },
      {
        test: /\.comp\.css$/,
        use: [
          {
            loader: "to-string-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: [/styles\.css$/, /reset\.css$/],
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              attrs: ["img:src"]
            }
          }
        ]
      },
      {
        test: /\.(png|gif|jpg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "img/[name]-[hash:8].[ext]"
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: "dist",
    overlay: true,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLWebpackPlugin({
      template: "./src/resources/index.html"
    })
  ]
};
