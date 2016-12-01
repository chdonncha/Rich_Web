import {Observable} from 'rxjs/Rx';

var Rx = require('rxjs/Rx');

var canvas = document.getElementById('canvas');
var timeDisplay = document.getElementById('display');
var timerSubscription;
var timerSource;

var ctx = canvas.getContext('2d');
var radius = canvas.height / 2;
var currentTime = 0;
ctx.translate(radius, radius);
radius = radius * 0.90;
setInterval(drawClock, 100);

(function () {
  createTimerSource();
  updateCurrentTimeDisplay();
  registerButtonEvents();
})();

// Register the button events when the page loads.
function registerButtonEvents() {
  var startButton = document.getElementById('start');
  startButton.addEventListener(
    'click', function () { startTimer(); });

  var startButton = document.getElementById('stop');
  startButton.addEventListener(
    'click', function () { stopTimer(); });

  var startButton = document.getElementById('reset');
  startButton.addEventListener(
    'click', function () { resetTimer(); });
}
// Create the Observable we will listen to for our time events.
function createTimerSource() {
  timerSource = Observable.interval(10)
    .timeInterval()
    .map(function (x) { return x.interval; })
    .share();
}

// Register to the timer Observable so that we can consistently update the current timer.
function startTimer() {
  // Ensure timer is stopped
  stopTimer();

  timerSubscription = timerSource.subscribe(
    function (x) {
      currentTime += x;
      updateCurrentTimeDisplay();
    },
    function (err) {

    },
    function () {

    });
}

// Stops the timer but does not reset the timer. Once start is clicked again the timer will
// continue from the last value it left off at.
function stopTimer() {
  if (timerSubscription != null) {
    timerSubscription.unsubscribe();
  }
  updateCurrentTimeDisplay();
}
// Resets the timer and ensure the display is updated since the timer may be reset while
// a countdown is not running and since the display is only updated on a "need to know" basis
// it may not always be updated.
function resetTimer() {
  currentTime = 0;
  updateCurrentTimeDisplay();
}
// Used to update the html display element with the current time.
function updateCurrentTimeDisplay() {  
  var seconds = Math.floor((currentTime / 1000) % 60);  
  var minutes = Math.floor((currentTime / (1000 * 60)) % 60);
  var tenths = Math.floor((currentTime / 100) % 10);

  timeDisplay.innerHTML = minutes+":"+seconds+":"+tenths;
}
// Draws the entire clock as a whole.
function drawClock() {
  drawFace(ctx, radius);
  drawPathToNumbers(ctx, radius);
  drawStopWatch(ctx, radius);
}

// Draws the hands on the timer and calculates rotation.
function drawStopWatch(ctx, radius) {

  var seconds = currentTime / 1000;
  var minutes = currentTime / 60000;
  var secondsAngle = seconds * Math.PI / 30;
  var minutesAngle = minutes * Math.PI / 30;

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#555555";

  drawHand(ctx, secondsAngle, radius * 0.8, radius * 0.0125);
  drawHand(ctx, minutesAngle, radius * 0.7, radius * 0.0125);
}

function drawFace(ctx, radius) {
  drawOuterFace(ctx, radius);
  // Draws over hands.
  InnerArc(ctx, radius)
}

function InnerArc(ctx, radius) {
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.025, 0, 2 * Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();
}

// Draws the outer face that surrounds the clock inside of it.
function drawOuterFace(ctx, radius) {
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  grad = ctx.createRadialGradient(0, 0, radius * 0.9875, 0, 0, radius * 1.0125);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.2, '#fff');
  grad.addColorStop(0.8, '#fff');
  grad.addColorStop(1, '#333');
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius * 0.04;
  ctx.stroke();
}

// Dras the lines on the clock which represent the numbers of the timer.
function drawPathToNumbers(ctx, radius) {
  var num;
  var ang;
  var tickPlaces = 65;
  for (num = 1; num < tickPlaces; num++) {
    ang = num * Math.PI / 30;
    ctx.beginPath();
    ctx.rotate(ang);
    if (num % 5 == 0) {
      ctx.moveTo(0, -radius * 0.70);
      ctx.lineWidth = 2;
    } else {
      ctx.moveTo(0, -radius * 0.80);
      ctx.lineWidth = 1;
    }
    ctx.lineTo(0, -radius * 0.85);
    ctx.stroke();

    ctx.rotate(-ang);
  }
}

// Draw a hand through passing in the desired parameters.
function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}
