var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var Timer = require('./Timer');
var EventEmitter = require('events');

var timer;
var tickHandler;
var startHandler;
var stopHandler;

beforeEach(function () {
  timer = new Timer();
  this.clock = sinon.useFakeTimers();
  tickHandler = sinon.spy();
  startHandler = sinon.spy();
  stopHandler = sinon.spy();
  completeHandler = sinon.spy();
});
afterEach(function () {
  this.clock.restore();
});

describe('BasicTimer', function () {


  it('should be a function', function () {
    expect(Timer).to.be.a('function');
  });

  it('should be an instance of EventEmitter', function () {
    expect(timer).to.be.an.instanceof(EventEmitter);
  });


  it.skip('should emit a "tick" event every second', function () {
    timer.on('tick', tickHandler);

    this.clock.tick(1000);
    expect(tickHandler.called).to.be.true;

    this.clock.tick(500);
    expect(tickHandler.callCount).to.equal(1);

    this.clock.tick(500);
    expect(tickHandler.callCount).to.equal(2);
  });
});

describe('Controls', function () {

  it('should have "start" and "stop" method', function () {
    expect(timer.start).to.exist;
    expect(timer.stop).to.exist;
  });

  it('should not auto-start', function () {
    timer.on('tick', tickHandler);

    this.clock.tick(1000);
    expect(tickHandler.called).to.be.false;
  });

  it('should emit start when start method is called', function () {
    timer.on('start', startHandler);
    timer.start();
    expect(startHandler.called).to.be.true;
    expect(startHandler.callCount).to.be.equal(1);

    this.clock.tick(5000);
    expect(startHandler.callCount).to.be.equal(1);
  });

  it('should emit tick when start is called', function() {
    timer.on('tick', tickHandler);
    timer.start();

    this.clock.tick(1000);
    expect(tickHandler.called).to.be.true;
  });

  it('should emit stop when stop method is called', function () {
    timer.on('stop', stopHandler);
    timer.stop();
    expect(stopHandler.called).to.be.true;
    expect(stopHandler.callCount).to.be.equal(1);

    this.clock.tick(5000);
    expect(stopHandler.callCount).to.be.equal(1);
  });

  it('should stop the timer when stop method is called', function () {
    timer.on('tick', tickHandler);
    timer.start();

    this.clock.tick(4500);
    expect(tickHandler.callCount).to.be.equal(4);
    timer.stop();

    this.clock.tick(500);
    expect(tickHandler.callCount).to.be.equal(4);
  });

  it('should restart from the same time', function () {
    timer.on('tick', tickHandler);
    timer.start();

    this.clock.tick(4700);
    expect(tickHandler.callCount).to.be.equal(4);

    timer.stop();
    this.clock.tick(200);
    expect(tickHandler.callCount).to.be.equal(4);

    timer.start();
    this.clock.tick(300);
    expect(tickHandler.callCount).to.be.equal(5);

    this.clock.tick(800);
    expect(tickHandler.callCount).to.be.equal(5);

    this.clock.tick(200);
    expect(tickHandler.callCount).to.be.equal(6);

    this.clock.tick(500);
    expect(tickHandler.callCount).to.be.equal(6);

    timer.stop();
    this.clock.tick(500);
    expect(tickHandler.callCount).to.be.equal(6);

    timer.start();
    this.clock.tick(500);
    expect(tickHandler.callCount).to.be.equal(7);
  });
});

describe('Time Limit', function () {

  it('should have a default max value of 10 seconds', function () {
    var timer = new Timer();
    expect(timer.max).to.be.equal(10);
  });

  it('should accept any number as its max value', function () {
    var timer = new Timer(20);
    expect(timer.max).to.be.equal(20);

    var timer2 = new Timer(50);
    expect(timer2.max).to.be.equal(50);
  });

  it('should throw an error if a non-number is passed through', function (){
    expect(function () {
      var timer = new Timer('string');
      }).to.throw(Error);

    expect(function () {
      var timer = new Timer(null);
    }).to.throw(Error);

    expect(function () {
      var timer = new Timer(20);
    }).to.not.throw(Error);
  });

  it('should stop after the default amount of ticks', function () {
    timer.on('tick', tickHandler);
    timer.on('stop', stopHandler);
    timer.start();

    this.clock.tick(9500);
    timer.stop();

    this.clock.tick(1000);
    timer.start();
    this.clock.tick(500);
    expect(tickHandler.callCount).to.be.equal(10);
    expect(stopHandler.callCount).to.be.equal(2);
  });

  it('should stop after 20 ticks and timer should be at 20000 ms', function () {
    var timer = new Timer(20);

    timer.on('tick', tickHandler);
    timer.on('stop', stopHandler);
    timer.start();

    this.clock.tick(9500);
    timer.stop();

    this.clock.tick(1000);
    timer.start();

    this.clock.tick(600);
    timer.stop();

    this.clock.tick(1000);
    timer.start();

    this.clock.tick(10000);
    expect(tickHandler.callCount).to.be.equal(20);
    expect(stopHandler.callCount).to.be.equal(3);
    expect(timer.totalTime).to.be.equal(20000);
  });
});

describe ('Lag Event', function () {
  it('should have a default lag value of 50')
});