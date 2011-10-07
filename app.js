// var graphite 	= require('./index').graphite.create(2003, "localhost", true)
//   , collector 	= require('./index').collector.create(40000, "localhost");

var udpCollector = require('./index').collector.udp.create(40000, "localhost");
var state = require('./index').state;
var harvester = require('./index').harvester;
harvester.init(harvester.MINUTE);


var publisher = require('./index').publisher.disk.create('/tmp');

// setInterval( function() {
//     console.log( require('util').inspect(state.snapshot(), false, 10) );
//     // graphite.sendCollectorState( collector.snapshot() );
//     // collector.clear();

// }, 2000);



// harvester.on('harvest', function(data, date, period) {
// 	console.log(date);
// 	console.log(data);
// });
