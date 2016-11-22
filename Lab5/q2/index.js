import {Observable} from 'rxjs/Rx';

function canvas(){
    console.log("this is a test");
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "green";
    ctx.fillRect(10,10,100,100);
}

(function() { canvas(); })();