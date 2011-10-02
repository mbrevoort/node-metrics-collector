var	HOST = "localhost"
  , PORT = 40000
  , client = require('./lib/client.js').create(PORT, HOST);

client.incCounter("foo.joe.counter", 1);
client.markMeter("foo.joe.meter", Math.ceil(Math.random() * 100));
client.updateDecayHistogram("foo.joe.decayhist", Math.ceil(Math.random() * 100));
client.updateHistogram("foo.joe.hist", Math.ceil(Math.random() * 100));
client.updateTimer("foo.joe.timer", Math.ceil(Math.random() * 100));