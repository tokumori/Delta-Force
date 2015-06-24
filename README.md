# Delta Force
## Event Emitter exercise in nodejs

[Events and Emitters - Slides](http://slides.com/theremix/events-and-emitters)

### Recommendations
Use git flow.  
Each stage (at least) should be it's own feature branch.  
Start by writing tests for the first feature.  
After implementing, and finishing your feature, write tests for the next feature.  
Make sure all tests pass before moving on to the next feature.  
Use the _util_ module for extending classes.  
Use _nodemon_.  
Create an instance of your class for testing.  
Every time a new event can be emitted, immediately add a listener for it, and in the event handler, give yourself feedback for when that event is triggered, and print out any event data for inspection.  

### Goal
Create a Timer class that extends EventEmitter.  
Build out the Timer class in stages split by feature.  

1. [Basic Timer](#1-basic-timer)
2. [Controls](#2-controls)
3. [Time Limit](#3-time-limit)
4. [Lag event](#4-lag-event)
5. [Compensate for lag](#5-compensate-for-lag)

## 1. Basic Timer
Automatically starts timer on initialization.  
Emits a `'tick'` event every second.

## 2. Controls
Does not auto-start.  

Timer is started by invoking the `start()` method,
and emits a `'start'` event, with an event object containing the time the timer has started (in ms since Unix time).

Timer is stopped by invoking the `stop()` method,
and emits a `'stop'` event, with an event object containing the time the timer has stopped (in ms since Unix time).

Once the timer is stopped, it should immediately stop the running timer.

## 3. Time Limit
Timer accepts an optional argument that sets it's max time (in seconds), with a default of 10.  

If the timer in instantiated with a single argument `20`, then 20 `tick` events will be triggered.

When the final tick event is emitted, stop the timer, and emit a `'complete'` event, with an event object containing the total time (in ms) from the time the timer started to when it completed.

## 4. Lag Event
Timer accepts an optional second argument that set's the max allowed deviation from system time (in ms), with a default of 50.

If the timer ever ticks above or below the deviation from actual time, then emit a `'lag'` event, with an event object containing the offset (in ms) of when the `'tick'` event was emitted, and the actual time when it should have been emitted.

For example, if the 4th `'tick'` event is emitted **4065**ms after the `'start'` event, then `'lag'` should be emitted with an event object containing an offset time of **65**.

## 5. Compensate for lag
Refactor the timer interval to adjust and compensate for the lag of the timer.

After this feature is added, you should be able to lower your maximum allowed deviation and the `'lag'` event should rarely be emitted.

Example outcome:
```
var myTimer = new Timer(20,10);
myTimer.start();
```
```
start 1435137452311
tick 0
lag 22
tick 1
tick 2
tick 3
tick 4
tick 5
tick 6
tick 7
tick 8
tick 9
tick 10
tick 11
tick 12
tick 13
tick 14
tick 15
tick 16
tick 17
tick 18
tick 19
stop 1435137472316
complete 20005
```
