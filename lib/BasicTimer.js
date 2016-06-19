module.exports = BasicTimer;
var EventEmitter = require('events');
var util = require('util');

function BasicTimer () {
  var self = this;
  setInterval(function () {
    self.emit('tick');
  }, 1000);
}

util.inherits(BasicTimer, EventEmitter);