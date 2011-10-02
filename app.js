var graphite 	= require('./index').graphite.create(2003, "localhost", true)
  , collector 	= require('./index').collector.create(40000, "localhost");

setInterval( function() {
    console.log( require('util').inspect(collector.snapshot(), false, 10) );
    graphite.sendCollectorState( collector.snapshot() );
    collector.clear();

}, 2000);
