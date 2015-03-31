/**
 * Created by Alex on 3/3/2015.
 */

var eve = require("evejs");
var proxyAgent = require('./agents/proxyAgent');


// SET THE PORT HERE, do not change anything else.
var port = process.env.PORT || 5000;

console.log("using port:",port);

var proxy = new proxyAgent('proxy');

httpTransport = new eve.transport.HTTPTransport({
  type: 'http',
  url: 'http://127.0.0.1:' + port + '/agents/:id',
  localShortcut: false
});

proxy.connect(httpTransport);
proxy.ready.then(function () {
  wsTransport = new eve.transport.WebSocketTransport({
    type: 'ws',
    url: 'ws://127.0.0.1:' + port + '/agents/:id',
    localShortcut: false,
    httpTransport:httpTransport
  });
  proxy.connect(wsTransport);
});

