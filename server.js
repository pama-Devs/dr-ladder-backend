var http = require('http')

var app = require('./app')

var port = 4000;

var server = http.createServer(app)

server.listen(port,() => console.log(`Server listening to Port ${port}`))