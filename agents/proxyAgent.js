var eve = require('evejs');

function proxyAgent(id) {
  // execute super constructor
  eve.Agent.call(this, id);

  this.eventTypes = {};
  this.timelineEvents = [];

  this.timelineClients = {};
  this.inputClient = undefined;


  // extend the agent with RPC functionality
  this.rpc = this.loadModule('rpc', this.rpcFunctions, {timeout:2000}); // option 1

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll());
}

// extend the eve.Agent prototype
proxyAgent.prototype = Object.create(eve.Agent.prototype);
proxyAgent.prototype.constructor = proxyAgent;

proxyAgent.prototype.rpcFunctions = {};

proxyAgent.prototype.rpcFunctions.registerTimelineClient = function (params, sender) {
  console.log("registered timeline:",sender);
  this.timelineClients[sender] = new Date().valueOf();
  return true;
};

proxyAgent.prototype.rpcFunctions.setInputClient = function (params, sender) {
  console.log("set input:",sender);
  if (this.inputClient !== undefined) {
    this.rpc.request(this.inputClient,{method:"close",params:{}});
  }
  this.inputClient = sender;
  return true;
};

proxyAgent.prototype.rpcFunctions.reset = function (params, sender) {
  this.eventTypes = {};
  this.timelineEvents = [];
  return true;
};

proxyAgent.prototype.rpcFunctions.resetTimelineEvents = function (params, sender) {
  this.timelineEvents = [];
  if (this.timelineClient !== undefined) {
    this.rpc.request(this.timelineClient, {method:'resetTimelineEvents', params:{}})
  }
  return true;
};

proxyAgent.prototype.rpcFunctions.resetEventTypes = function (params, sender) {
  this.eventTypes = {};
  return true;
};

proxyAgent.prototype.rpcFunctions.addEventType = function (params, sender) {
  this.eventTypes[params.name] = {name:params.name, range:params.range, class:params.class};
  return true;
};

proxyAgent.prototype.rpcFunctions.addTimelineEvent = function (params, sender) {
  this.timelineEvents.push(params.item);
  var me = this;
  for (var client in this.timelineClients) {
    if (this.timelineClients.hasOwnProperty(client)) {

      // create a closure with the client.
      // if the client is unresponsive, remove from the list
      var handler = function(client,err) {
        if (err !== undefined) {
          if (err.message !== undefined) {
            if (typeof err.message === 'string') {
              // do not match full message as timeout may be customised
              if (err.message.indexOf('RPC Promise Timeout surpassed. Timeout: ') !== -1) {
                delete me.timelineClients[client];
                console.log("removing timeline:", client, " from list for being unresponsive.")
              }
            }
          }
        }
      }.bind(this,client);

      // request
      this.rpc.request(client, {method:'addTimelineEvent', params:params.item})
        .catch(handler)
        .done();
    }
  }
};

proxyAgent.prototype.rpcFunctions.getEventTypes = function (params, sender) {
  return this.eventTypes;
};

proxyAgent.prototype.rpcFunctions.getTimelineEvents = function (params, sender) {
  if (this.timelineClients[sender] === undefined) {
    this.timelineClients[sender] = new Date().valueOf();
    console.log("registered timeline:",sender);
  }
  return this.timelineEvents;
};

module.exports = proxyAgent;
