const path = require('path')
const express = require('express')
const http = require('http')

const favicon = require('serve-favicon')
const compression = require('compression');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const fileStreamRotator = require('file-stream-rotator')

require('./check-versions')()
// server
const app = express()
app.use(compression())

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// app.use(bodyParser({uploadDir:'./uploads'}));
app.set('jsonp callback name', config.jsonpCallback || 'callback');

// routers
app.use(express.static(path.join(__dirname, '../dist')))
app.use(function(req, res, next) {
  req.sendfild(path.join(__dirname, '../dist/index.html'))
})

// const server = app.listen(port)
const server = http.createServer(app)
server.listen(5757)
server.on('listening', () => onListening(server))

function onListening(sev) {
  let addr = sev.address()
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log('Http Listening on ' + bind)
}

module.exports = {
  close: () => {
    server.close()
  }
}
