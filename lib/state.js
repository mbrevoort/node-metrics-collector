var metrics = require('metrics')
  , ee = require('events').EventEmitter;

// State store the current state of the tracked metrics. It is a singleton
// it listens for 'ingest' events
// 
// it can also be flushed, etc.

function State() {
  this._trackedMetrics = {};
  this.on('ingest', ingest);
}

State.prototype = new ee();

module.exports = new State();


/**
 * Get the current state of all tracked metrics
 * @return a current snapshot of the State for all tracked metrics
 */
State.prototype.snapshot = function() {
  var metricsObj = {};

  for (var namespace in this._trackedMetrics) {
    metricsObj[namespace] = {};
    for (var name in this._trackedMetrics[namespace]) {
      metricsObj[namespace][name] = this._trackedMetrics[namespace][name].printObj();
    }
  }

  return metricsObj;
}

/**
 * Clear the current state of all tracked metrics
 */
State.prototype.clear = function() {
  for (var namespace in this._trackedMetrics) {
    for (var name in this._trackedMetrics[namespace]) {
      if (this._trackedMetrics[namespace][name]["clear"]) this._trackedMetrics[namespace][name].clear();
    }
  }
}


/**
 * 'ingest' event handler
 * Not called directly incase others want to hook into this event
 *
 * @param name {string}
 * @param namespace {string}
 * @param type {string}
 * @param action {string}
 * @param value {number}
 */ 
function ingest(name, namespace, type, action, value) {
  var metric = this._getOrCreateMetric(name, namespace, type);

  if (metric && metric[action]) {
      metric[action].call(metric, value);
  } else {
      console.log("Can't update metric '" + type);
      if (!metric[action]) console.log(action + " does not exist on " + type)
  }
}

State.prototype._getOrCreateMetric = function(name, namespace, type) {
  var newMetric = null;
  if (!this._trackedMetrics[namespace]) 
    this._trackedMetrics[namespace] = {};

  return this._trackedMetrics[namespace][name] || this._createMetric(name, namespace, type);
}

State.prototype._createMetric = function(name, namespace, type) {
  if (type === "Histogram") 
    return this._trackedMetrics[namespace][name] = new metrics.Histogram.createUniformHistogram();
  else if (type === "DecayHistogram") 
    return this._trackedMetrics[namespace][name] = new metrics.Histogram.createExponentialDecayHistogram();
  else 
    return this._trackedMetrics[namespace][name] = new metrics[type];
}