/**
 * Created by Alex on 3/3/2015.
 */

var eve = require('evejs');
var timelineAgent = require('./agents/timelineAgent');

eve.system.init({
  transports: [
    {
      type: 'ws',
      url: 'ws://client/agents/:id',
      default: true
    }
  ]
});

var proxyAddress = 'ws://127.0.0.1:5000/agents/proxy';
var proxyAddressHttp = 'http://127.0.0.1:5000/agents/proxy';

var timelineClient = new timelineAgent('timelineClient', proxyAddress);

timelineClient.wakeProxy(proxyAddressHttp);
timelineClient.connectToProxy();