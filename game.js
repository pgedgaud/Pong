var Game = function(canvas) {
    this.canvas = canvas;
    this.canvasContext = canvas.getContext("2d");
    this.framesPerSecond = 60;
    this.paddles = [];
    this.gameBall = null;
    this.isBallInGoal = false;
    this.lastPaddleHit = -1;
};

Game.prototype.initializeCanvas = function() {
    this.canvasContext.fillStyle = "black";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Game.prototype.onMouseMoved = function(y) {
    this.paddles[0].y = y - (this.paddles[0].height / 2);
};

Game.prototype.initializeObjects = function() {
    var firstPaddle = new Paddle();
    firstPaddle.x = 75;
    firstPaddle.thickness = 5;
    firstPaddle.height = 75;
    firstPaddle.backgroundColor = "white";

    this.paddles.push(firstPaddle);

    var secondPaddle = new Paddle();
    secondPaddle.x = this.canvas.width - 75;
    secondPaddle.thickness = 5;
    secondPaddle.height = 75;
    secondPaddle.backgroundColor = "white";

    this.paddles.push(secondPaddle);

    for (var i = 0; i < this.paddles.length; i ++) {
        this.paddles[i].y = (this.canvas.height / 2) - (this.paddles[i].height / 2);
    }

    this.gameBall = new Ball();
    this.gameBall.x = this.canvas.width / 2;
    this.gameBall.y = this.canvas.height / 2;
    this.gameBall.backgroundColor = "white";
    this.gameBall.radius = 5;
    this.gameBall.endAngle = 0;
    this.gameBall.xVelocity = 5;
    this.gameBall.yVelocity = 5;
};

Game.prototype.reset = function() {
    this.gameBall.x = this.canvas.width / 2;
    this.gameBall.y = this.canvas.height / 2;
    this.gameBall.xVelocity = -this.gameBall.xVelocity;
    this.isBallInGoal = false;
};

Game.prototype.drawObjects = function() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.initializeCanvas();
    for (var i = 0; i < this.paddles.length; i++) {
        this.canvasContext.fillStyle = this.paddles[i].backgroundColor;
        this.canvasContext.fillRect(
            this.paddles[i].x,
            this.paddles[i].y,
            this.paddles[i].thickness,
            this.paddles[i].height
        );
    }

    this.canvasContext.beginPath();
    this.canvasContext.arc(
        this.gameBall.x,
        this.gameBall.y,
        this.gameBall.radius,
        this.gameBall.endAngle,
        Math.PI * 2,
        true
    );
    this.canvasContext.fill();
    this.canvasContext.closePath();
};

Game.prototype.update = function() {
    this.gameBall.update();
    
    if (this.gameBall.x < this.paddles[0].x + this.paddles[0].thickness) {
        if (this.gameBall.y > this.paddles[0].y &&
            this.gameBall.y < (this.paddles[0].y + this.paddles[0].height)) {

            this.gameBall.xVelocity = -this.gameBall.xVelocity;
            this.lastPaddleHit = 0;
        }
        if (this.gameBall.x < this.canvas.clientLeft) {
            this.isBallInGoal = true;
        }
    }
    else if (this.gameBall.x >= this.paddles[1].x) {
        this.lastPaddleHit = 1;
        this.gameBall.xVelocity = -(this.gameBall.xVelocity);
    }

    if (this.gameBall.y > this.canvas.height || this.gameBall.y < 0) {
        this.gameBall.yVelocity = -this.gameBall.yVelocity;
    }
    console.log(this.lastPaddleHit);
    /* This is wrap-around code!
    if (gameBall.x > canvas.width) {
        gameBall.x -= gameBall.x;
    }
    */
};