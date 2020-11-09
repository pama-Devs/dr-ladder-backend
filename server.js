var http = require('http')

var app = require('./app')

var port = 5000;

var server = http.createServer(app)

server.listen(port,() => console.log(`Server listening to Port ${port}`))