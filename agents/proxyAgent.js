var eve = require('evejs');

function proxyAgent(id) {
  // execute super constructor
  eve.Agent.call(this, id);

  this.eventTypes = {};
  this.timelineEvents = [];

  this.timelineClient = undefined;
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

proxyAgent.prototype.rpcFunctions.setTimelineClient = function (params, sender) {
  console.log(sender);
  if (this.timelineClient !== undefined) {
    this.rpc.request(this.timelineClient,{method:"close",params:{}})
  }
  this.timelineClient = sender;
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
  if (this.timelineClient !== undefined) {
    this.rpc.request(this.timelineClient, {method:'addTimelineEvent', params:params})
  }
  return true;
};

proxyAgent.prototype.rpcFunctions.getEventTypes = function (params, sender) {
  return this.eventTypes;
};

proxyAgent.prototype.rpcFunctions.getTimelineEvents = function (params, sender) {
  return this.timelineEvents;
};

proxyAgent.prototype.rpcFunctions.wakeUp = function (params, sender) {
  console.log("received wakeUp signal from", sender);
  return true;
};

module.exports = proxyAgent;
