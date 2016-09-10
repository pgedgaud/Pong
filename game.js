var Game = function(canvas) {
    this.canvas = canvas;
    this.canvasContext = canvas.getContext("2d");
    this.framesPerSecond = 60;
    this.paddles = [];
    this.gameBall = null;
    this.isBallInGoal = false;
    this.lastPaddleHit = -1;
    this.score = {
        1: 0,
        2: 0
    };
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
    this.gameBall.yVelocity = STARTING_Y_VELOCITY;
    this.isBallInGoal = false;
    this.lastPaddleHit = -1;
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
    this.canvasContext.closePath();
    this.canvasContext.fill();
};

Game.prototype.update = function() {
    this.gameBall.updatePosition();
    this.calculateAi(this.gameBall);
    var collisionInfo = this.gameBall.checkCollisionsWith(this.paddles, this.canvas);
    
    this.isBallInGoal = collisionInfo.isBallInGoal;
    if (collisionInfo.lastPaddleHit != -1) {
        this.lastPaddleHit = collisionInfo.lastPaddleHit;
    }
    if (collisionInfo.isBallInGoal) {
        this.score[this.lastPaddleHit]++;
    }
    /* This is wrap-around code!
    if (gameBall.x > canvas.width) {
        gameBall.x -= gameBall.x;
    }
    */
};

Game.prototype.calculateAi = function(gameBall) {
    if (this.paddles[1].getCenter() > gameBall.y &&
        this.paddles[1].y > 0) {
        
        this.paddles[1].y -= 4;
    }
    else if (this.paddles[1].getCenter() < gameBall.y &&
             this.paddles[1].y < this.canvas.clientHeight){
        
        this.paddles[1].y += 4;
    }
};