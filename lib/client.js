var dgram = require('dgram');

var Client = function (port, host) {
    this.port = port;
    this.host = host;
}

module.exports.create = function(port, host) {
    return new Client(port, host);
}

Client.prototype.send = function(name, type, action, data) {
    // build the simple serialized message rather than using JSON.stringify for performance sake
    var message = '{ "name":"' + name + '",' + '"type":"' + type + '",' + '"action":"' + action + '",' + '"data":' + Number(data) + '}';
    console.log("sending message " + message);
    var buffer = new Buffer(message);
    var client = dgram.createSocket("udp4");
    client.send(buffer, 0, buffer.length, this.port, this.host);
    client.close();
};


// for all of the accepted actions and types, create functions on sender 
["update", "mark", "inc", "dec", "clear"].forEach(function(action) {
	["Timer", "Counter", "Meter", "Histogram", "DecayHistogram"].forEach(function(type) {
	    Client.prototype[action + type] = function(name, value) {
	        this.send(name, type, action, value);
	    };
	});
});

 