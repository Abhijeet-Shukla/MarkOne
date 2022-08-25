const http = require('http');
const app = require('./backend/app')

const { env } = require('process');

const port = process.env.PORT || 3000;

app.set('port', port)

const server = http.createServer(app)

server.listen(port, function(){
  console.log("Server started...")
});
