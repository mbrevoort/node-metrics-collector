var harvester = require('../harvester')
  , fs = require('fs')


function Disk(directory) {
  this.dir = directory;
  this.stream = fs.createWriteStream(this.dir + "/metrics.log", {
  	flags: 'a',
  	encoding: 'utf8',
  	mode: 0666
  });

  harvester.on('harvest', this.publish.bind(this));
}

module.exports.create = function(directory) {
    return new Disk(directory);
}

Disk.prototype.publish = function(data, date, period) {
  var payload = {
    date: date,
    period: period,
    periodLabel: harvester.periodLabel(period),
    data: data
  }
	this.stream.write(JSON.stringify(payload) + "\n");
	this.stream.flush();
}