var	HOST = "localhost"
  , udpClient = require('./index').client.udp.create(40000, HOST, true)
  , tcpClient = require('./index').client.tcp.create(10000, HOST, true);

udpClient.incCounter("foo.joe.counter", 1);
udpClient.markMeter("foo.joe.meter", Math.ceil(Math.random() * 100));
udpClient.updateDecayHistogram("foo.joe.decayhist", Math.ceil(Math.random() * 100));
udpClient.updateHistogram("foo.joe.hist", Math.ceil(Math.random() * 100));
udpClient.updateTimer("foo.joe.timer", Math.ceil(Math.random() * 100));

tcpClient.incCounter("bar.joe.counter", 1);
tcpClient.markMeter("bar.joe.meter", Math.ceil(Math.random() * 100));
tcpClient.updateDecayHistogram("bar.joe.decayhist", Math.ceil(Math.random() * 100));
tcpClient.updateHistogram("bar.joe.hist", Math.ceil(Math.random() * 100));
tcpClient.updateTimer("bar.joe.timer", Math.ceil(Math.random() * 100));