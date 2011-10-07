var dgram = require('dgram')
  , BaseCollector = require('./_baseCollector');


// var collector = require('collector').create(port, host)
function UDP(port, host) {
  this.server = null;
  this.type = "UDP";
  this._init(port, host);
}

module.exports.create = function(port, host) {
    return new UDP(port, host);
}

UDP.prototype = new BaseCollector();

UDP.prototype._init = function(port, host) {
  var self = this;

  this.server = dgram.createSocket("udp4");

  this.server.on("message", function(msg, rinfo) {
    //console.log("got message, trying to call receiveMetric");
    self.receiveMetric(msg.toString('utf8'));
  });

  this.server.on("listening", function() {
    var address = self.server.address();
    console.log("UDP metrics collector listening " + address.address + ":" + address.port);
  });

  this.server.bind(port, host);
}