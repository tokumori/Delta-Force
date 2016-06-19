var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var BasicTimer = require('./BasicTimer');
var EventEmitter = require('events');


describe('BasicTimer', function () {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers();
  });
  afterEach(function () {
    this.clock.restore();
  });

  it('should be a function', function () {
    expect(BasicTimer).to.be.a('function');
  });

  it('should be an instance of EventEmitter', function () {
    var timer = new BasicTimer();
    expect(timer).to.have.constructor(BasicTimer);
    expect(timer).to.be.an.instanceof(EventEmitter);
  });


  it('should emit a "tick" event every second', function () {
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