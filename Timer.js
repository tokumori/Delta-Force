var EventEmitter = require('events');
var util = require('util');

module.exports = Timer;

function Timer (max, lag, msInterval) {
  if ((max !== undefined && typeof max !== 'number') || lag !== undefined && typeof lag !== 'number') {
    throw new TypeError();
  }
  EventEmitter.call(this);
  var self = this;
  this.i = 0;
  this.totalTime = 0;
  this.mSecRemainder = 0;
  this.max = max || 10;
  this.lag = lag || 50;
  this.msInterval = msInterval || 1000;
}

util.inherits(Timer, EventEmitter);

Timer.prototype.start = function () {
  this.startTime = Date.now();
  this.lagTime = 0;
  var self = this;
  if ((self.lagTime > Math.abs(self.lag)) && self.lagTime !== 0) {
    this.msInterval += this.lagTime;
  }
    this.lastTick = Date.now();
    if (this.totalTime === 0) {
      this.interval = setInterval(function () {
        self.emit('tick', {interval : self.i++});
        if (self.i >= self.max) {
          self.stop();
          self.emit('complete', {totalTime: self.totalTime});
        }
      }, self.msInterval);
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
        }, self.msInterval);
      }, self.mSecRemainder);
    }
    this.emit('start', {startTime: this.startTime});
    this.on('tick', function () {
      var now = Date.now();
      self.lagTime = (now - this.lastTick) - 1000;
      console.log('Time from last tick ' + (now - this.lastTick));
      if ((self.lagTime > Math.abs(self.lag)) && self.lagTime !== 0) {
        this.emit('lag', {lag: self.lagTime});
      }
      console.log('Lag adjusted ' + (1000 - (self.lagTime)));
      this.lastTick = now;
    });
};

Timer.prototype.stop = function () {
  this.stopTime = Date.now();
  this.totalTime += (this.stopTime - this.startTime);
  this.emit('stop', {stopTime: this.stopTime});
  clearInterval(this.interval);
};

var timer = new Timer(10, 1);

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

function lagHandler (event) {
  process.stdout.write('lag ' + this.lagTime + ' \n');
}

timer.addListener('tick', tickHandler);
timer.addListener('start', startHandler);
timer.addListener('stop', stopHandler);
timer.addListener('complete', completeHandler);
timer.addListener('lag', lagHandler);

timer.start();
// setTimeout(function() {
//   timer.stop();
// }, 9100);
// setTimeout(function() {
//   timer.start();
// }, 15000);