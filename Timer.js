var EventEmitter = require('events');
var util = require('util');

module.exports = Timer;

function Timer () {
  EventEmitter.call(this);
  var self = this;
  this.i = 0;
  this.totalTime = 0;
  this.start = function () {
    this.startTime = Date.now();
    this.emit('start', {startTime: this.startTime});
    if (this.totalTime === 0) {
      this.interval = setInterval(function () {
        self.emit('tick', {interval : self.i++});
      }, 1000);
    } else {
      var mSecRemainder = 1000 - (this.totalTime % 1000);
      this.interval = setInterval(function () {
        self.emit('tick', {interval : self.i++});
        clearInterval(self.interval);
        self.interval = setInterval(function () {
          self.emit('tick', {interval: self.i++});
        }, 1000);
      }, mSecRemainder);
    }
  };
  this.stop = function () {
    this.stopTime = Date.now();
    this.totalTime += this.stopTime - this.startTime;
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
  process.stdout.write('start ' + this.startTime + ' ' + ' \n');
}

function stopHandler (event) {
  process.stdout.write('stop ' + this.stopTime + ' ' + this.totalTime + ' \n');
}

timer.addListener('tick', tickHandler);
timer.addListener('start', startHandler);
timer.addListener('stop', stopHandler);

timer.start();
setTimeout(function() {
  timer.stop();
}, 4700);
setTimeout(function() {
  timer.start();
}, 5100);