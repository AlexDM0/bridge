/**
 * Created by Alex on 3/3/2015.
 */

var eve = require('evejs');
var RPCAgent = require('./agents/RPCAgent');

var port = process.env.PORT;
console.log(port);

eve.system.init({
  transports: [
    {
      type: 'http',
      url: 'https://mighty-waters-2966.herokuapp.com:' + port + '/agents/:id',
      localShortcut: false,
      port:port,
      default: true
    }
  ]
});

// create two agents
var agent1 = new RPCAgent('agent1');
//var agent2 = new RPCAgent('agent2');

// send a message to agent1
//agent2.askToAdd('https://mighty-waters-2966.herokuapp.com:' + port + '/agents/agent1', {a: 1, b: 2});

// catch error, send a message to a non-existing agent will fail
//agent2.rpc.request('agent4', {method: 'add', params: {a: 1, b: 2}})
//  .then(function (reply) {
//    console.log(reply);
//  })
//  .catch(function (err) {
//    console.log(err)
//  });