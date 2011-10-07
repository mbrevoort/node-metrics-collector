var ee = require('events').EventEmitter
  , state = require('./state');

// The Harvester periodically harvests metrics and emits events
// with those event details. It's the component with the sole 
// responsibility of getting the metrics directly from the in-memory
// state and clearing the state
//
// Currently the harvestor harvests all metrics with the same periodicity
//
// emits 'harvest' with data state, date and period

function Harvester() {
  console.log("Harvester constructor");

  this._interval = null;
  this._firstTimeout = null;
}

Harvester.prototype = new ee();

module.exports = new Harvester();

Harvester.prototype.MINUTE = 60000;
Harvester.prototype.HOUR = 3600000;
Harvester.prototype.DAY = 86400000;

/**
 *
 * @param period {enum} one of Harvester.MINUTE, Harvester.HOUR, Harvester.DAY
 */
Harvester.prototype.init = function(period) {
  // TODO test if period is a number
  var self = this;

  this.period = period;

  var now = Date.now()
    , firstTimerOffset = period - (now % period);

  this._firstTimeout = setTimeout(function() {
    self._harvest();
    self._interval = setInterval(self._harvest.bind(self), period);
  }, firstTimerOffset);
};

Harvester.prototype._harvest = function() {
  var snapshot = state.snapshot();
  state.clear();
  //console.log(snapshot);
  this.emit('harvest', snapshot, new Date(), this.period);
};

Harvester.prototype.periodLabel = function(period) {
  switch(period) {
    case this.MINUTE:
      return "Minute";
    case this.HOUR:
      return "Hour";
    case this.Day:
      return "Day";
    default:
      return "unknown";
  }
}




