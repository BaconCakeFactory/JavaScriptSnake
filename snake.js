var screenHeight = $(window).height();
var screenWidth = $(window).width();

var tileSize = 40;

// 0 = up, 1 = left, 2 = down, 3 = right;
var moveDir = 3;
// input that sets move direction
var inputMoveDir = 3;

// -1 to avoid half sized square at screen edge
var tilesRoundedHeight = Math.floor(screenHeight / tileSize) - 1;
var tilesRoundedWidth = Math.floor(screenWidth / tileSize) - 1;

var xPos = 0;
var yPos = 0;

var xPosE;
var yPosE;

var snakelength = 1;

var velocity = 100;
var difficulty = 1;
var trail = true;
var dieOnBorder = false;

var position = [
    [xPos, yPos]
];

var c, c2;
var ctx, ctx2;

var bgcolor = "#00001a";
var snakecolor = "#000000";
var ediblecolor = "#000000";

var paused = false;
var alive = false;

// reposition overlays to center if window is resized
window.addEventListener('resize', function(event) { center(); }, true);

function center() {
    var ww = window.innerWidth;                         // get website width
    var wh = window.innerHeight;                        // get website height

    // center "new game" overlay - 10 for the 5px border
    var ng = document.getElementById("ng");
    ng.style.marginTop = (wh - ng.clientHeight - 10) / 2 + "px";
    ng.style.marginLeft = (ww - ng.clientWidth - 10) / 2 + "px";
    
    // center "game over" overlay
    var go = document.getElementById("go");
    go.style.marginTop = (wh - go.clientHeight - 10) / 2 + "px";
    go.style.marginLeft = (ww - go.clientWidth - 10) / 2 + "px";
    
    // center "pause" overlay
    var pi = document.getElementById("pause-inner");
    pi.style.marginTop = (wh - pi.clientHeight - 10) / 2 + "px";
    pi.style.marginLeft = (ww - pi.clientWidth - 10) / 2 + "px";
}

$(document).ready(function () {
    // center overlays
    center();
    $("#go").hide();
    pause();
    
    c1 = document.getElementById("gameCanvas");
    c1.width = tilesRoundedWidth * tileSize;
    c1.height = tilesRoundedHeight * tileSize;
    ctx = c1.getContext("2d");

    c2 = document.getElementById("underGameCanvas");
    c2.width = tilesRoundedWidth * tileSize;
    c2.height = tilesRoundedHeight * tileSize;
    ctx2 = c2.getContext("2d");
    

    // change background color of body
    $("body").css("background-color", "" + bgcolor + "");
    
    // add functionality to trail button
    $("#trail").click(function() {
        trail = !trail;
        
        if(trail) {
            $(this).css("color", "green");
        } else {
            $(this).css("color", "black");
        }
        //console.log(trail);
    });

    // add functionality to border collision button
    $("#dieOnBorder").click(function() {
        dieOnBorder = !dieOnBorder;
        
        if(dieOnBorder) {
            $(this).css("color", "green");
        } else {
            $(this).css("color", "black");
        }
    });
});

$(document).on("keydown", function(e) {
    switch (e.which) {
        case 38: // up
        case 87: // w
            inputMoveDir = 0;
            break;
        case 37: // left
        case 65: // a
            inputMoveDir = 1;
            break;
        case 40: // down
        case 83: // s
            inputMoveDir = 2;
            break;
        case 39: // right
        case 68: // d
            inputMoveDir = 3;
            break;
        case 32:
        case 27:
        case 80:
            paused = !paused;
            pause();
            break;
    }
});

function pause() {
    // if player is dead, there is no need to pause the game
    if(!alive) {
        paused = false;
        $("#pause").hide();
        return;
    }
    if(!paused) {
        $("#pause").hide();
        return;
    }
    // center overlays
    $("#pause").show();
    center();
}

function newGame() {
    // center overlays
    center();
    xPos = Math.floor((tilesRoundedWidth / 2)) - 1;
    yPos = Math.floor((tilesRoundedHeight / 2)) - 1;

    $(".ol").hide();
    $("#screen").hide();
    
    // call pause to disable pause screen
    pause();

    alive = true;

    velocity = $("#geschwindigkeit").val();
    difficulty = $("#difficulty").val();
    snakecolor = $.xcolor.random();
    
    setTimeout(function () {
        update();
        edible();
    }, 300);
    
    //var borderdiv = $('<div id="borderoverlay"></div>');
    //$("body").append(borderdiv);
    //$("#borderoverlay").css("height", "" + (tilesRoundedHeight * tileSize) + "px");
    //$("#borderoverlay").css("width", "" + (tilesRoundedWidth * tileSize) + "px");


    // center canvas
    var ww = window.innerWidth;                         // get website width
    var wh = window.innerHeight;                        // get website height

    c1 = document.getElementById("gameCanvas");
    c1.style.marginTop = (wh - (tilesRoundedHeight * tileSize)) / 2;
    c1.style.marginLeft = (ww - (tilesRoundedWidth * tileSize)) / 2;

    c2 = document.getElementById("underGameCanvas");
    c2.style.marginTop = (wh - (tilesRoundedHeight * tileSize)) / 2;
    c2.style.marginLeft = (ww - (tilesRoundedWidth * tileSize)) / 2;
}

function update() {
    setTimeout(function () {
        if(alive) {
            if(!paused) {
                // input and  movement direction equal
                if(inputMoveDir == moveDir) {
                    moveDir = inputMoveDir;
                    // not equal
                } else {
                    if(moveDir == 0) {
                    if(inputMoveDir == 2) {
                        moveDir = moveDir;
                    } else {
                        moveDir = inputMoveDir;
                    }
                    } else if(moveDir == 1) {
                        if(inputMoveDir == 3) {
                            moveDir = moveDir;
                        } else {
                            moveDir = inputMoveDir;
                        }
                    } else if(moveDir == 2) {
                        if(inputMoveDir == 0) {
                            moveDir = moveDir;
                        } else {
                            moveDir = inputMoveDir;
                        }
                    } else if(moveDir == 3) {
                        if(inputMoveDir == 1) {
                            moveDir = moveDir;
                        } else {
                            moveDir = inputMoveDir;
                        }
                    } else {
                        moveDir = moveDir;
                    }
                }
                
                // move snake
                if (moveDir == 0) {
                    yPos--;
                } else if (moveDir == 2) {
                    yPos++;
                } else if (moveDir == 1) {
                    xPos--;
                } else if (moveDir == 3) {
                    xPos++;
                } else {
                    
                }
                
                // check if snake should die
                if(collision(xPos, yPos)){
                    // if dieOnBorder true, snake will die on border collision
                    if(dieOnBorder) death();
                }
                
                // wrap snake around
                if (xPos > (tilesRoundedWidth - 1)) {
                    xPos = 0;
                } else if (yPos > (tilesRoundedHeight - 1)) {
                    yPos = 0;
                } else if (xPos < 0) {
                    xPos = tilesRoundedWidth - 1;
                } else if (yPos < 0) {
                    yPos = tilesRoundedHeight - 1;
                }
                
                drawSnake();
                drawEd();
            }
            update();
        }
    }, velocity);
}

function drawSnake() {
    // remove Snake
    for (var i = 0; i <= position.length; i++) {
        if (position.length >= snakelength) {
            if (i < snakelength) {
                ctx.fillStyle = bgcolor;
                ctx.clearRect(position[i][0] * tileSize, position[i][1] * tileSize, tileSize, tileSize);
            }
        }
    }
    
    position.push([xPos, yPos]);

    // draw snake
    for (var i = 0; i <= position.length; i++) {

        if (position.length > snakelength) {
            position.shift();
        }
        if (position.length >= snakelength) {
            if (i < snakelength) {
                // body
                ctx.fillStyle = $.xcolor.darken(snakecolor);
                ctx.fillRect(position[i][0] * tileSize, position[i][1] * tileSize, tileSize, tileSize);
                ctx.fillStyle = snakecolor;
                ctx.fillRect((position[i][0] * tileSize) + 4, (position[i][1] * tileSize) + 4, tileSize - 8, tileSize - 8);
                
                // head
                if(i == snakelength - 1) {
                    ctx.fillStyle = $.xcolor.darken(snakecolor);
                    ctx.fillRect(position[i][0] * tileSize, position[i][1] * tileSize, tileSize, tileSize);
                    ctx.fillStyle = $.xcolor.lighten(snakecolor);
                    ctx.fillRect((position[i][0] * tileSize) + 8, (position[i][1] * tileSize) + 8, tileSize - 16, tileSize - 16);

                    // if trail is activated
                    if(trail == true) {
                        // draw trail on second canvas
                        ctx2.fillStyle = $.xcolor.lighten(snakecolor);
                        ctx2.fillRect((position[i][0] * tileSize) + ((tileSize / 2) - 5), (position[i][1] * tileSize) + ((tileSize / 2) - 5), 10, 10);
                    }
                }
            }
        }
    }
    
    // collision with food
    if ((yPos == yPosE) && (xPos == xPosE)) {
        snakelength++;
        snakecolor = avgcolor(snakecolor, ediblecolor);
        edible();
    }
    
    // collision with snake
    for (var i = 0; i < (position.length - 1); i++) {
        if((position[i][0] == xPos) && (position[i][1] == yPos)) {
            death();
        }
    }
}

function edible() {
    xPosE = Math.floor(Math.random() * ((tilesRoundedWidth - 1) - 0 + 1)) + 0;
    yPosE = Math.floor(Math.random() * ((tilesRoundedHeight - 1) - 0 + 1)) + 0;

    // console.log("edible: x( " + xPosE + " ), y( " + yPosE + " )");

    ediblecolor = $.xcolor.random();
}

var edibleDistanz = 2;

function drawEd() {
    var altX = xPosE;
    var altY = yPosE;
    
    // food movement probability
    var wannaMove;
    
    // difficulty
    if(difficulty == 0) {
        wannaMove = -1;
    } else if(difficulty == 1) {
        wannaMove = 0.04;
    } else {
        wannaMove = 0.2
    }
    
    // food movement
    if((Math.random() < wannaMove)) {
        var moveDirE = Math.floor(Math.random() * 4);
        if(moveDirE == 0) {
            if(!collision(xPosE, yPosE - edibleDistanz)) {
                yPosE -= edibleDistanz;
            }
        } else if(moveDirE == 1) {
            if(!collision(xPosE - edibleDistanz, yPosE)) {
                xPosE -= edibleDistanz;
            }
        } else if(moveDirE == 2) {
            if(!collision(xPosE, yPosE + edibleDistanz)) {
                yPosE += edibleDistanz;
            }
        } else if(moveDirE == 3) {
            if(!collision(xPosE + edibleDistanz, yPosE)) {
                xPosE += edibleDistanz;
            }
        }
    }
    
    // remove old food if position has changed
    if((altX != xPosE) || (altY != yPosE)) {
        // console.log("Andere position: " + altX + " -> " + xPosE + " || " + altY + " -> " + yPosE);
        ctx.clearRect(altX * tileSize, altY * tileSize, tileSize, tileSize);
    }
        
    
    // add new food
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(xPosE * tileSize, yPosE * tileSize, tileSize, tileSize);
    ctx.fillStyle = $.xcolor.random();
    ctx.fillRect(xPosE * tileSize, yPosE * tileSize, tileSize, tileSize);
    ctx.fillStyle = ediblecolor;
    ctx.fillRect((xPosE * tileSize) + 3, (yPosE * tileSize) + 3, tileSize - 6, tileSize - 6);
    
    
}

function collision(xPosition, yPosition) {
    if (xPosition > (tilesRoundedWidth - 1)) {
        return true;
    } else if (yPosition > (tilesRoundedHeight - 1)) {
        return true;
    } else if (xPosition < 0) {
        return true;
    } else if (yPosition < 0) {
        return true;
    } else {
        return false;
    }
}

function death() {
    $("#go").show();
    $("#ng").hide();
    $("#screen").show();

    // center overlays
    center();

    alive = false;
    pause();

    if(snakelength > 1) { $("#punkte").text(snakelength.toString() + " Punkte"); }
    
    $("#borderoverlay").remove();
}

function newGameScreen() {
    location.reload();
}


function avgcolor(color1, color2) {
    var avg = function (a, b) {
            return (a + b) / 2;
        },
        t16 = function (c) {
            return parseInt(('' + c).replace('#', ''), 16)
        },
        hex = function (c) {
            var t = (c >> 0).toString(16);
            return t.length == 2 ? t : '0' + t
        },
        hex1 = t16(color1),
        hex2 = t16(color2),
        r = function (hex) {
            return hex >> 16 & 0xFF
        },
        g = function (hex) {
            return hex >> 8 & 0xFF
        },
        b = function (hex) {
            return hex & 0xFF
        },
        res = '#' + hex(avg(r(hex1), r(hex2))) +
        hex(avg(g(hex1), g(hex2))) +
        hex(avg(b(hex1), b(hex2)));
    return res;
}
