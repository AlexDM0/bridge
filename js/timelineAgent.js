function timelineAgent(id, proxyAddress) {
  // execute super constructor
  eve.Agent.call(this, id);

  this.proxyAddress = proxyAddress;

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
timelineAgent.prototype = Object.create(eve.Agent.prototype);
timelineAgent.prototype.constructor = timelineAgent;

timelineAgent.prototype.rpcFunctions = {};

timelineAgent.prototype.connectToProxy = function() {
  this.rpc.request(this.proxyAddress, {method:'setTimelineClient',params:{}}).done();
};

timelineAgent.prototype.rpcFunctions.setInputClient = function (params, sender) {
  if (this.inputClient !== undefined) {
    this.rpc.request(this.inputClient,{method:'close',params:{}})
  }
  this.inputClient = sender;
  return true;
};

timelineAgent.prototype.rpcFunctions.reset = function (params, sender) {
  this.eventTypes = {};
  this.timelineEvents = [];
  return true;
};

timelineAgent.prototype.rpcFunctions.resetTimelineEvents = function (params, sender) {
  this.timelineEvents = [];
  return true;
};

timelineAgent.prototype.rpcFunctions.resetEventTypes = function (params, sender) {
  this.eventTypes = {};
  return true;
};

timelineAgent.prototype.rpcFunctions.addEventType = function (params, sender) {
  this.eventTypes[params.type] = {start:params.start, end:params.end, class:params.class};
  return true;
};

timelineAgent.prototype.rpcFunctions.addTimelineEvent = function (params, sender) {
  this.timelineEvents.push(params.event);
  return true;
};

timelineAgent.prototype.rpcFunctions.getEventTypes = function (params, sender) {
  return this.eventTypes;
};

timelineAgent.prototype.rpcFunctions.getTimelineEvents = function (params, sender) {
  return this.timelineEvents;
};

timelineAgent.prototype.rpcFunctions.wakeUp = function (params, sender) {
  return true;
};
