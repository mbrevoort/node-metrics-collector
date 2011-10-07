var _ = require('underscore')
  , state = require('../state');


var BaseCollector = function() {
  this.type = null; 
}

module.exports = BaseCollector;

BaseCollector.prototype.parseAndValidateMessage = function(msg) {
  var message = {};
  if (!msg) return null;

  try {
      message = JSON.parse(msg);
  } catch (err) {
      console.log("Failed to parse " + this.type + " received metric message: " + msg);
      return null;
  }

  // check that the name is present
  if (!message["name"]) {
      console.log("Received " + this.type + " message with no name: " + msg);
      return null
  }

  // validate the message type
  if (!message["type"] || !_.contains(["Timer", "Counter", "Meter", "Histogram", "DecayHistogram"], message["type"])) {
      console.log("Received " + this.type + " message of invalid type: " + msg);
      return null
  }

  // validate action
  if (!_.contains(["update", "mark", "inc", "dec", "clear"], message["action"])) {
      console.log("Received " + this.type + " message of invalid action: " + msg);
      return null
  }

  // if we make it here, the message is valid
  return message;
};

/**
 *
 * expects a UDP message of stringifies JSON like
 * {
      name: "package.path.name",
      type: "Timer",    // [Timer, Counter, Meter, Histogram],
      action: "update", // [update, mark, inc, dec, clear],
      data: 1           // some number
    }
 */

BaseCollector.prototype.receiveMetric = function(msg) {
  var message = this.parseAndValidateMessage(msg);
  console.log("in receiveMetric");

  if (message !== null) {
    var namespaces = message.name.split('.')
      , name = namespaces.pop()
      , namespace = namespaces.join('.')
      , type = message.type
      , action = message.action
      , value = message.data;

    // emit on name, namespace, message.type, message.data
    console.log('trying to emit state');
    state.emit('ingest', name, namespace, type, action, value);

    
  }
};
