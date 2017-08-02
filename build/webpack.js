require('shelljs/global')
const ora = require('ora')
const opn = require('opn')
const path = require('path')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')
const compression = require('compression');
const proxyMiddleware = require('http-proxy-middleware')
const version = require('./check-versions')()

const config = require('./webpack.config')
const webpackConfig = require('./webpack.base.js')
const spinner = ora('building for ' + process.env.NODE_ENV + ' ...')

function _clear(path) {
  let directory = `${config.output.path}/${path || '*'}`
  rm('-rf', directory);
  path && mkdir('-p', directory);
}

function buildPro() {
  _clear('assets')
  _clear('views')

  spinner.start()
  webpack(webpackConfig, function(err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    }) + '\n')
    console.log(chalk.cyan('  Build complete.\n'))
      // console.log(chalk.yellow())
  })
}

function buildDev() {
  const port = process.env.NODE_ENV === 'production' ? config.pro.port : config.dev.port;
  // server
  const app = express()
  app.use(compression())

  const compiler = webpack(webpackConfig)
  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: false,
    noInfo: true,
  })
  const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {},
  });
  // force page reload when html-webpack-plugin template changes
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
      hotMiddleware.publish({
        action: 'reload'
      })
      cb()
    })
  })

  app.use(devMiddleware)
  app.use(hotMiddleware)

  // proxy
  const proxyTable = config.dev.proxyTable
  proxyTable && Object.keys(proxyTable).forEach(key => app.use(proxyMiddleware(key, proxyTable[key])))

  // assets
  config.assetsCopy.data.forEach(value => app.use('/' + value.to, express.static(value.from)))

  console.log('> Starting dev server...')
  devMiddleware.waitUntilValid(() => {
    const uri = 'http://localhost:' + config.dev.port
    console.log('> Listening at ' + uri + '\n')
    config.dev.autoOpenBrowser && process.env.NODE_ENV !== 'production' && opn(uri)
  })

  app.use(function(req, res, next) {
    req.url = '/'
    app.handle(req, res, next)
  })


  const server = app.listen(port)
  server.on('error', error => {
    if (error.syscall !== 'listen') {
      throw error
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(port + ' requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(port + ' is already in use')
        process.exit(1)
        break
      default:
        throw error
    }
  })
}

process.env.NODE_ENV === 'development' ? buildDev() : buildPro();
