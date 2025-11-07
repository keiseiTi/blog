---
title: webpack4：如何搭建
date: 2018-08-26 14:47:21
tags: [webpack,webpack配置]
category: webpack
---

    一直想学习webpack的环境配置，由于种种原因，一直拖到了这周才终于下定决定要弄明白。
    目前已经搭好了一个webpack4的react环境，虽然是从0到1搭建的，但过程中参考了create-react-app和vue-cli的webpack配置。


第一步: 基本使用
首先新建一个目录，然后
```
npm init -y
npm i webpack webpack-cli --save-dev
```

<!-- more -->


最后目录结构为 
```
src
|- index.js
package.json
package-lock.json
```
现在打开package.json为scripts填充script脚本
```
"start": "webpack --mode development",
"build": "webpack --mode production"
```
在`src/index.js`：`console.log('hello world');`
尝试运行
`npm run start`会发现在目录中生成一个`dist/main.js`文件，打开并发现里面的代码未压缩。
`npm run build`会发现在目录中生成一个`dist/main.js`文件，打开并发现里面的代码已压缩。
这是因为webapck4的默认模式`development`和`production`，已经帮我们做好了某些事。具体可以参考
>https://webpack.docschina.org/concepts/mode/

第二步: react应用
```
npm i @babel/core @babel/preset-env @babel/preset-react babel-loader@^8.0.0-beta --save-dev
npm i react react-dom -s
```
新建`webpack.config.js`内容为:
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
```
新建`.babelrc`内容为:
```javascript
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```
新建`index.html`内容为:
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>react</title>
</head>
<body>
  <div id="app"></div>
  <script src="./dist/main.js"></script>
</body>
</html>
```
然后`npm run dev`，打开`index.html`，发现`hello world`。
这就完成了webpack配置的react的基本应用。

第三步: 增加配置
```
npm i html-webpack-plugin mini-css-extract-plugin --save-dev
```
`webpack.config.js`的内容为下:
```javascript
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
}
```
`npm run dev`之后，`dist`有`index.html`文件的产生，并且`index.html`里已经注入`main.js`的源

第4步: webapck-dev-server

要设置webpack dev server，请安装包:
`npm i webpack-dev-server -s`
有两种方式使用:
1.用命令行的方式:
```javascript
"scripts": {
  "dev": "webpack-dev-server --mode development --open --color --compress --hot",
  "build: "webpack --mode production"
}
```
2.用配置文件的方式
新建`devServer.config.js`:
```javascript
module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: 'localhost',
    port: 8001,
    open: true,
    overlay: false,
    publicPath: '/',
    proxy: {},
    quiet: true,
    inline: true,
    watchOptions: {
      poll: false,
    },
    progress: true
  },
}
```
在`package.json`中的`scripts`写着
`"dev": "webpack-dev-server --mode development --config devServer.config.js"`
注意：配置型的`webpack dev server`需要与`webpack.config.js`配合使用，可以使用`webpack-merge`

3.用`node.js`的方式

4.使用`express`和`webpack-dev-middleware`的方式


注：热更新，需要在`webpack.config.js`中的`plugins`加入`new webpack.HotModuleReplacementPlugin()`，(使用`node.js`的方式在入口`entry`需要增加`require.resolve('webpack/hot/dev-server')`)

**后续增加，less，eslint，prettierrc如何配合webapck的使用**


