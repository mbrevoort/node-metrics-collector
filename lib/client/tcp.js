var net = require('net')
  , BaseClient = require('./_baseClient');

var TCPClient = function (port, host, debug) {
    this.port = port;
    this.host = host;
    this.debug = debug || false;
}


module.exports.create = function(port, host, debug) {
    return new TCPClient(port, host, debug);
}

TCPClient.prototype = new BaseClient();

TCPClient.prototype.send = function(name, type, action, data) {
    var message = this.formatMessage(name, type, action, data);
    this.debug && console.log("sending TCP message " + message);

    var client = net.Socket();
    client.connect(this.port, this.host, function() {
       client.end(message + "\n", "utf8");
    });
};
 