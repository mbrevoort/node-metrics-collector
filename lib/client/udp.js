var dgram = require('dgram')
  , BaseClient = require('./_baseClient');

var UDPClient = function (port, host, debug) {
    this.port = port;
    this.host = host;
    this.debug = debug || false;
}


module.exports.create = function(port, host, debug) {
    return new UDPClient(port, host, debug);
}

UDPClient.prototype = new BaseClient();

UDPClient.prototype.send = function(name, type, action, data) {
    var message = this.formatMessage(name, type, action, data);
    this.debug && console.log("sending UDP message " + message);
    var buffer = new Buffer(message);
    var client = dgram.createSocket("udp4");
    client.send(buffer, 0, buffer.length, this.port, this.host);
    client.close();
};
 