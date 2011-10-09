var BaseClient = function() {};

module.exports = BaseClient;

BaseClient.prototype.formatMessage = function(name, type, action, data) {
    return '{ "name":"' + name + '",' + '"type":"' + type + '",' + '"action":"' + action + '",' + '"data":' + Number(data) + '}';
};

// for all of the accepted actions and types, create functions on sender 
["update", "mark", "inc", "dec", "clear"].forEach(function(action) {
	["Timer", "Counter", "Meter", "Histogram", "DecayHistogram"].forEach(function(type) {
	    BaseClient.prototype[action + type] = function(name, value) {
	        this.send(name, type, action, value);
	    };
	});
});

 BaseClient.prototype.incCounter = function() {
 	
 };