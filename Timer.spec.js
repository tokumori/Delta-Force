var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var Timer = require('./Timer');
var EventEmitter = require('events');

describe('BasicTimer', function () {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers();
  });
  afterEach(function () {
    this.clock.restore();
  });

  it('should be a function', function () {
    expect(Timer).to.be.a('function');
  });

  it('should be an instance of EventEmitter', function () {
    var timer = new Timer();
    expect(timer).to.be.an.instanceof(EventEmitter);
  });


  it.skip('should emit a "tick" event every second', function () {
    var tickHandler = sinon.spy();
    var timer = new BasicTimer();
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
  beforeEach(function () {
    this.clock = sinon.useFakeTimers();
  });
  afterEach(function () {
    this.clock.restore();
  });

  it('should have "start" and "stop" method', function () {
    var timer = new Timer();
    expect(timer.start).to.exist;
    expect(timer.stop).to.exist;
  });

  it('should not auto-start', function () {
    var tickHandler = sinon.spy();
    var timer = new Timer();
    timer.on('tick', tickHandler);

    this.clock.tick(1000);
    expect(tickHandler.called).to.be.false;
  });

  it('should emit start when start method is called', function () {
    var timer = new Timer();
    var startHandler = sinon.spy();

    timer.on('start', startHandler);
    timer.start();
    expect(startHandler.called).to.be.true;
    expect(startHandler.callCount).to.be.equal(1);

    this.clock.tick(5000);
    expect(startHandler.callCount).to.be.equal(1);
  });

  it('should emit tick when start is called', function() {
    var timer = new Timer();
    var tickHandler = sinon.spy();

    timer.on('tick', tickHandler);
    timer.start();

    this.clock.tick(1000);
    expect(tickHandler.called).to.be.true;
  });

  it('should emit stop when stop method is called', function () {
    var timer = new Timer();
    var stopHandler = sinon.spy();

    timer.on('stop', stopHandler);
    timer.stop();
    expect(stopHandler.called).to.be.true;
    expect(stopHandler.callCount).to.be.equal(1);

    this.clock.tick(5000);
    expect(stopHandler.callCount).to.be.equal(1);
  });

  it('should stop the timer when stop method is called', function () {
    var timer = new Timer();
    var tickHandler = sinon.spy();

    timer.on('tick', tickHandler);
    timer.start();

    this.clock.tick(4500);
    expect(tickHandler.callCount).to.be.equal(4);
    timer.stop();

    this.clock.tick(500);
    expect(tickHandler.callCount).to.be.equal(4);
  });

  it('should restart from the same time', function () {
    var timer = new Timer();
    var tickHandler = sinon.spy();

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
  beforeEach(function () {
    this.clock = sinon.useFakeTimers();
  });
  afterEach(function () {
    this.clock.restore();
  });

  it('should have a default max value of 10 seconds', function () {
    var timer = new Timer();
    expect(timer.max).to.be.equal(10);
  }) ;

  it('should accept any number as its max value', function () {
    var timer = new Timer(20);
    expect(timer.max).to.be.equal(20);

    var timer2 = new Timer(50);
    expect(timer2.max).to.be.equal(50);
  })

  it('should throw an error if a non-number is passed through', function (){

  });

});