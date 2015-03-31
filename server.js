var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs")
var HTMLport = 5000;


var server = http.createServer(function(request, response) {
  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(HTMLport, 10));

console.log("Static file server running at\n  => http://localhost:" + HTMLport + "/\nCTRL + C to shutdown");


var eve = require("evejs");
var proxyAgent = require('./agents/proxyAgent');
var proxy = new proxyAgent('proxy');

proxy.ready.then(function () {
  wsTransport = new eve.transport.WebSocketTransport({
    type: 'ws',
    url: 'ws://127.0.0.1:' + HTMLport + '/agents/:id',
    localShortcut: false,
    httpTransport:{server:server}
  });
  proxy.connect(wsTransport);
});

