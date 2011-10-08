// var graphite 	= require('./index').graphite.create(2003, "localhost", true)
//   , collector 	= require('./index').collector.create(40000, "localhost");

var udpCollector = require('./index').collector.udp.create(40000, "localhost");
var tcpCollector = require('./index').collector.tcp.create(10000, "localhost");
var state = require('./index').state;
var harvester = require('./index').harvester;
harvester.init(harvester.MINUTE);

var publisher = require('./index').publisher.disk.create('/tmp');
var graphite = require('./index').publisher.graphite.create(41000, "localhost", true);
