import {Observable} from 'rxjs/Rx';

var Rx = require('rxjs/Rx');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var radius = canvas.height / 2;
var timerSubscription;
ctx.translate(radius, radius);
radius = radius * 0.90;
setInterval(drawClock, 100);

(function() { registerButtonEvents(); })();

function registerButtonEvents() {
//   var startButton = document.getElementById('start');
//   startButton.addEventListener(
//       'click', function() { addOperatorToDisplay('*'); });
}

function setupTimer() {
  var pauser = new Rx.Subject();



  timerSubscription = source.subscribe(
      function(x) { console.log(x); },
      function(err) {

      },
      function() {

      });
  var element = document.getElementById('display');
  element.innerHTML = source;
}

function startTimer() {


      var source = Observable.interval(500)
                   .timeInterval()
                   .map(function(x) { return x.value + ':' + x.interval; })
                   .share();
}

function stopTimer(){
    if(timerSubscription != null){
        timerSubscription.unsubscribe();
    }
}

function drawClock() {
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius);
  //updateTimer();
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

function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius * 0.15 + 'px arial';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  for (num = 1; num < 13; num++) {
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);

    // ctx.beginPath();
    // ctx.moveTo(20, 0);
    // ctx.lineTo(0, 20);
    // ctx.stroke();

    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx, radius) {
  var now = new Date();
  //var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var tenthSecond = second;


  // hour
//   hour = hour % 12;
//   hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) +
//       (second * Math.PI / (360 * 60));
//   drawHand(ctx, hour, radius * 0.5, radius * 0.0125);


  // minute
  minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
  drawHand(ctx, minute, radius * 0.8, radius * 0.02);

  // second
  second = (second * Math.PI / 30);
  drawHand(ctx, second, radius * 0.9, radius * 0.0125);
}

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
