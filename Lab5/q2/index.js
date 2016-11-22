
function canvas(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    ctx.fillStype = "green";
    ctx.fillRect(10,10,100,100);
}

(function() { canvas(); })();