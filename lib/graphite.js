var net = require('net');


var Graphite = function (port, host, debug) {
	this.graphite_port = port;
	this.graphite_host = host || "127.0.0.1";
	this.debug = debug || false;	
};

module.exports.create = function(port, host, debug) {
	return new Graphite(port, host, debug);
}

Graphite.prototype.send = function(statString) {
	try {
	    var graphite = net.createConnection(this.graphite_port, this.graphite_host);
	    graphite.addListener('error', function(connectionException) {
	        if (this.debug) {
	            console.log(connectionException);
	        }
	    });
	    graphite.on('connect', function() {
	        this.write(statString);
	        this.end();
	        if(this.debug) console.log("sent: " + statString);
	    });
	} catch (e) {
	    if (this.debug) {
	        console.log(e);
	    }
	}

};


Graphite.prototype.sendCollectorState = function(collectorState) {
	var epoch =  Math.round(new Date().getTime() / 1000),
		graphitePayload = "",
		self = this;

	Object.keys(collectorState).forEach(function(namespace) {
		Object.keys(collectorState[namespace]).forEach(function(name) {
			var stat = collectorState[namespace][name];
			if(stat.type === 'counter') {
				graphitePayload += self._buildLine( [namespace, name], "count", stat, epoch );
			}
			else if(stat.type === 'meter') {
				graphitePayload += self._buildMeter( [namespace, name], stat, epoch );
			}
			else if(stat.type === 'histogram') {
				graphitePayload += self._buildHistogram( [namespace, name], stat, epoch );
			}
			else if(stat.type === 'timer') {
				graphitePayload += self._buildMeter( [namespace, name, 'rate'], stat.rate, epoch );
				graphitePayload += self._buildHistogram( [namespace, name, 'duration'], stat.duration, epoch );
			}
			if(stat.clear) stat.clear();
		});
	});
	//console.log(graphitePayload);
	this.send(graphitePayload);
};

Graphite.prototype._buildMeter = function(path, stat, epoch) {
	var result = [];
	result.push( this._buildLine(path, "count", stat, epoch) );
	result.push( this._buildLine(path, "m1", stat, epoch) );
	result.push( this._buildLine(path, "m5", stat, epoch) );
	result.push( this._buildLine(path, "m15", stat, epoch) );
	result.push( this._buildLine(path, "mean", stat, epoch) );
	return result.join("");
}


Graphite.prototype._buildHistogram = function(path, stat, epoch) {
	var result = [];
	result.push( this._buildLine(path, "count", stat, epoch) );
	result.push( this._buildLine(path, "min", stat, epoch) );
	result.push( this._buildLine(path, "max", stat, epoch) );
	result.push( this._buildLine(path, "sum", stat, epoch) );
	result.push( this._buildLine(path, "mean", stat, epoch) );
	result.push( this._buildLine(path, "median", stat, epoch) );
	result.push( this._buildLine(path, "std_dev", stat, epoch) );
	result.push( this._buildLine(path, "p75", stat, epoch) );
	result.push( this._buildLine(path, "p95", stat, epoch) );
	result.push( this._buildLine(path, "p99", stat, epoch) );
	result.push( this._buildLine(path, "p999", stat, epoch) );
	return result.join("");
}

Graphite.prototype._buildLine = function(path, prop, stat, epoch) {
	return (stat[prop]) ? (path.join('.') + "." + prop + " " + stat[prop] + ' ' + epoch + "\n") : "";
};


