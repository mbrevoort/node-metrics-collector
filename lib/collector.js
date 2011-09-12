var metrics     = require('metrics'),
    dgram       = require('dgram'),
    _           = require('underscore'),
    graphite    = require('./graphite.js');


// var collector = require('collector').create(port, host)


var Collector = function(port, host) {
        this.server = null;
        this._trackedMetrics = {};
        this._init(port, host);
    };

module.exports.create = function(port, host) {
    return new Collector(port, host);
}    

Collector.prototype.snapshot = function() {
    var metricsObj = {};
    for (namespace in this._trackedMetrics) {
        metricsObj[namespace] = {};
        for (name in this._trackedMetrics[namespace]) {
            metricsObj[namespace][name] = this._trackedMetrics[namespace][name].printObj();
        }
    }
    return metricsObj;
}

Collector.prototype.clear = function() {
    for (namespace in this._trackedMetrics) {
        for (name in this._trackedMetrics[namespace]) {
            if (this._trackedMetrics[namespace][name]["clear"]) this._trackedMetrics[namespace][name].clear();
        }
    }
}

Collector.prototype._init = function(port, host) {
    var self = this;

    this.server = dgram.createSocket("udp4");

    this.server.on("message", function(msg, rinfo) {
        self._receiveMetric(msg.toString('utf8'));
    });

    this.server.on("listening", function() {
        var address = self.server.address();
        console.log("server listening " + address.address + ":" + address.port);
    });

    this.server.bind(port, host);
}

/**
 *
 * expects message like
 * {
        name: "package.path.name",
        type: "Timer",  [Timer, Counter, Meter, Histogram],
        action: "update", [update, mark, inc, dec, clear],
        data: 1 // some number
    }
 */

Collector.prototype._receiveMetric = function(msg) {
    var message = this._parseAndValidateMessage(msg),
        namespaces = message.name.split('.'),
        name = namespaces.pop(),
        namespace = namespaces.join('.'),
        metric = this._getOrCreateMetric(name, namespace, message.type);

    if (metric && metric[message.action]) {
        metric[message.action].call(metric, message.data);
    } else {
        console.log("Can't update metric '" + message.type);
        if (!metric[message.action]) console.log(message.action + " does not exist on " + message.type)
    }
}

Collector.prototype._parseAndValidateMessage = function(msg) {
    var message = {};
    if (!msg) return null;

    try {
        message = JSON.parse(msg);
    } catch (err) {
        console.log("Failed to parse received metric message: " + msg);

    }

    // check that the name is presetn
    if (!message["name"]) {
        console.log("Received message with no name: " + msg);
        return null
    }

    if (!message["type"] || !_.contains(["Timer", "Counter", "Meter", "Histogram", "DecayHistogram"], message["type"])) {
        console.log("Received message of invalid type: " + msg);
        return null
    }

    if (!_.contains(["update", "mark", "inc", "dec", "clear"], message["action"])) {
        console.log("Received message of invalid action: " + msg);
        return null
    }

    // if we make it here, the message is valid
    return message;
}

Collector.prototype._getOrCreateMetric = function(name, namespace, type) {
    var newMetric = null;
    if (!this._trackedMetrics[namespace]) this._trackedMetrics[namespace] = {};

    return this._trackedMetrics[namespace][name] || this._createMetric(name, namespace, type);
}

Collector.prototype._createMetric = function(name, namespace, type) {
    if (type === "Histogram") return this._trackedMetrics[namespace][name] = new metrics.Histogram.createUniformHistogram();
    else if (type === "DecayHistogram") return this._trackedMetrics[namespace][name] = new metrics.Histogram.createExponentialDecayHistogram();
    else return this._trackedMetrics[namespace][name] = new metrics[type];
}