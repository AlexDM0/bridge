var connect = require('connect'),
  serveStatic = require('serve-static'),
  compression = require('compression'),
  morgan = require('morgan');

var port = process.env.PORT || 5000;

var app = connect();
app.use(compression());
app.use(morgan('combined'));
app.use(serveStatic('./'));

var server = app.listen(port);

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

var eve = require("evejs");
var proxyAgent = require('./agents/proxyAgent');
var proxy = new proxyAgent('proxy');

proxy.ready.then(function () {
  wsTransport = new eve.transport.WebSocketTransport({
    type: 'ws',
    url: 'ws://127.0.0.1:' + port + '/agents/:id',
    localShortcut: false,
    httpTransport:{server:server}
  });
  proxy.connect(wsTransport);
});

