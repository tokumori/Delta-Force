var EventEmitter = require('events');
var util = require('util');

module.exports = Timer;

function Timer () {
  EventEmitter.call(this);
  var self = this;
  this.i = 0;
  this.start = function () {
    this.startTime = Date.now();
    this.emit('start', {startTime: this.startTime});
    this.interval = setInterval(function () {
      self.emit('tick', {interval : self.i++});
    }, 1000);
  };
  this.stop = function () {
    this.stopTime = Date.now();
    this.emit('stop', {stopTime: this.stopTime});
    clearInterval(this.interval);
  };
}


util.inherits(Timer, EventEmitter);

var timer = new Timer();

function tickHandler (event) {
  process.stdout.write('tick ' + this.i + ' \n');
}

function startHandler (event) {
  process.stdout.write('start \n');
}

function stopHandler (event) {
  process.stdout.write('stop \n');
}

timer.addListener('tick', tickHandler);
timer.addListener('start', startHandler);
timer.addListener('stop', stopHandler);
