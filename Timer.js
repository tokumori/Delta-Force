var EventEmitter = require('events');
var util = require('util');

module.exports = Timer;

function Timer (max) {
  if (max !== undefined && typeof max !== 'number') {
    throw new TypeError();
  }
  EventEmitter.call(this);
  var self = this;
  this.i = 0;
  this.totalTime = 0;
  this.max = max || 10;
}

util.inherits(Timer, EventEmitter);

Timer.prototype.start = function () {
  this.startTime = Date.now();
  var self = this;
  if (this.totalTime === 0) {
    this.interval = setInterval(function () {
      self.emit('tick', {interval : self.i++});
      if (self.i >= self.max) {
        self.stop();
        self.emit('complete', {totalTime: self.totalTime});
      }
    }, 1000);
  } else {
    this.mSecRemainder = 1000 - (this.totalTime % 1000);
    this.interval = setInterval(function () {
      self.emit('tick', {interval : self.i++});
      clearInterval(self.interval);
      if (self.i >= self.max) {
        self.stop();
        self.emit('complete', {totalTime: self.totalTime});
      }
      self.interval = setInterval(function () {
        self.emit('tick', {interval: self.i++});
        if (self.i >= self.max) {
          self.stop();
          self.emit('complete', {totalTime: self.totalTime});
        }
      }, 1000);
    }, self.mSecRemainder);
  }
  this.emit('start', {startTime: this.startTime});
};

Timer.prototype.stop = function () {
  this.stopTime = Date.now();
  this.totalTime += this.stopTime - this.startTime;
  this.emit('stop', {stopTime: this.stopTime});
  clearInterval(this.interval);
};

var timer = new Timer(20);

function tickHandler (event) {
  process.stdout.write('tick ' + this.i + ' \n');
}

function startHandler (event) {
  process.stdout.write('start ' + this.mSecRemainder + ' \n');
}

function stopHandler (event) {
  process.stdout.write('stop ' + this.stopTime + ' \n');
}

function completeHandler (event) {
  process.stdout.write('complete ' + event.totalTime + ' \n');
}

timer.addListener('tick', tickHandler);
timer.addListener('start', startHandler);
timer.addListener('stop', stopHandler);
timer.addListener('complete', completeHandler);

timer.start();
setTimeout(function() {
  timer.stop();
}, 9100);
setTimeout(function() {
  timer.start();
}, 9500);