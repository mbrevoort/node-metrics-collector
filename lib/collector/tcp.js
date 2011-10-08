var net = require('net')
  , BaseCollector = require('./_baseCollector');


function TCP(port, host) {
  this.server = null;
  this.type = "TCP";
  this._init(port, host);
}

module.exports.create = function(port, host) {
    return new TCP(port, host);
}

TCP.prototype = new BaseCollector();

TCP.prototype._init = function(port, host) {
  var self = this;

  this.server = net.createServer();
  this.host = host;
  this.port = port;

  console.log("TCP metrics collector listening on " + host + ":" + port);

  this.server.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
      console.log('TCP Address in use, retrying...');
      setTimeout(function () {
        self.server.close();
        self.server.listen(port, host);
      }, 1000);
    }
  });  

  this.server.on('connection', function (socket) {
    var acc  = [];
    socket.setEncoding('utf8');

    socket.on('data', function(data) {
      data.split("").forEach(function(c) { 
        if(c === "\n") { 
          self.receiveMetric(acc.join(""));
          acc.length=0; 
        } 
        else { 
          acc.push(c); 
        }
      });
    });

    socket.on('end', function() {
      var message = acc.join('');
      if(message)
        self.receiveMetric(message);
    });
  });

  this.server.on('close', function () {
    console.log("TCP server closed");
  });

  this.server.listen(port, host);
}