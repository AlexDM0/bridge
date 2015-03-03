/**
 * Created by Alex on 3/3/2015.
 */

var eve = require('evejs');
var RPCAgent = require('./agents/RPCAgent');

eve.system.init({
  transports: [
    {
      type: 'http',
      url: 'https://mighty-waters-2966.herokuapp.com:3000/agents/:id',
      localShortcut: false,
      default: true
    }
  ]
});

// create two agents
var agent1 = new RPCAgent('agent1');
var agent2 = new RPCAgent('agent2');

// send a message to agent1
agent2.askToAdd('https://mighty-waters-2966.herokuapp.com:3000/agents/agent1', {a: 1, b: 2});

// catch error, send a message to a non-existing agent will fail
agent2.rpc.request('agent4', {method: 'add', params: {a: 1, b: 2}})
  .then(function (reply) {
    console.log(reply);
  })
  .catch(function (err) {
    console.log(err)
  });