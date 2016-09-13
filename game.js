var Game = function(canvas, settings) {
    this.gameSettings = new GameSettings();
    this.canvas = canvas;
    this.canvasContext = canvas.getContext("2d");
    this.input = new Input(InputTypes.keyboard);
    this.framesPerSecond = 60;
    this.paddles = [];
    this.gameBall = null;
    this.isBallInGoal = false;
    this.hasPlayerWon = false;
    this.lastPaddleHit = -1;
    this.score = {
        1: 0,
        2: 0
    };
    this.sounds = {
        ballHitsWall: new Audio("sounds/ball_hits_wall.wav"),
        paddleOneHit: new Audio("sounds/paddle_one_hit.wav"),
        paddleTwoHit: new Audio("sounds/paddle_two_hit.wav")
    };
    this.difficulty = this.gameSettings.difficulty[settings.difficultySetting];
    this.maxGoals = settings.maxGoals;
};

Game.prototype.initializeCanvas = function() {
    this.canvasContext.fillStyle = "black";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.font = "40px Courier New";
};

Game.prototype.onMouseMoved = function(y) {
    if (y > this.paddles[0].getCenter() &&
        this.paddles[0].getBottom() <= this.canvas.clientHeight) {
        
        this.paddles[0].moveTo(y);
    }
    else if (y < this.paddles[0].getCenter() &&
             this.paddles[0].getTop() >= this.canvas.clientTop) {
        
        this.paddles[0].moveTo(y);
    }
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
    this.gameBall.xVelocity = STARTING_X_VELOCITY;
    this.gameBall.yVelocity = STARTING_Y_VELOCITY;
};

Game.prototype.reset = function() {
    this.gameBall.x = this.canvas.width / 2;
    this.gameBall.y = this.canvas.height / 2;
    this.gameBall.xVelocity = -this.gameBall.xVelocity;
    this.gameBall.yVelocity = STARTING_Y_VELOCITY;
    this.isBallInGoal = false;
    this.lastPaddleHit = -1;
};

Game.prototype.endGame = function() {
    this.reset();
    this.score = {
        1: 0,
        2: 0
    };
}

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
    
    this.drawScoreInformation();
};

Game.prototype.drawScoreInformation = function() {
    var canvasMiddleX = this.canvas.clientWidth / 2;
    var playerOneScoreX = canvasMiddleX - 50;
    var playerTwoScoreX = canvasMiddleX + 50;
    this.canvasContext.fillText(this.score[1], playerOneScoreX, 50);
    this.canvasContext.fillText(this.score[2], playerTwoScoreX, 50);
};

Game.prototype.processInput = function() {
    if (this.gameSettings.players == 2) {
        if (this.input.keysPressed[KeyCodes.up] &&
            this.paddles[1].getTop() > this.canvas.clientTop) {
            this.paddles[1].moveUp(6);
        }
        if (this.input.keysPressed[KeyCodes.down] &&
            this.paddles[1].getBottom() < this.canvas.clientHeight) {
            this.paddles[1].moveDown(6);
        }
    }
    
    if (this.input.keysPressed[KeyCodes.w] &&
        this.paddles[0].getTop() > this.canvas.clientTop) {
        
        this.paddles[0].moveUp(6);
    }
    if (this.input.keysPressed[KeyCodes.s] &&
        this.paddles[0].getBottom() < this.canvas.clientHeight) {
        this.paddles[0].moveDown(6);
    }
};

Game.prototype.drawPlayerWonScreen = function() {
    
};

Game.prototype.playSounds = function(collisionInfo) {
    if (collisionInfo.lastPaddleHit != -1) {
        this.lastPaddleHit = collisionInfo.lastPaddleHit;
        if (this.lastPaddleHit == 1) {
            this.sounds.paddleOneHit.play();
        }
        else {
            this.sounds.paddleTwoHit.play();
        }
    }
    
    if (collisionInfo.isWallHit) {
        this.sounds.ballHitsWall.play();
    }
};

Game.prototype.update = function() {
    this.processInput();
    this.gameBall.updatePosition();
    
    if (this.gameSettings.players == 1) {
        this.calculateAi(this.gameBall);
    }
    var collisionInfo = this.gameBall.checkCollisionsWith(this.paddles, this.canvas);
    
    this.playSounds(collisionInfo);
    this.isBallInGoal = collisionInfo.isBallInGoal;
    if (collisionInfo.isBallInGoal) {
        this.score[collisionInfo.playerScored]++;
        if (this.score[collisionInfo.playerScored] == this.maxGoals) {
            this.endGame();
        }
    }
    /* This is wrap-around code!
    if (gameBall.x > canvas.width) {
        gameBall.x -= gameBall.x;
    }
    */
};

Game.prototype.calculateAi = function(gameBall) {
    var distanceFromCenter = Math.abs(this.paddles[1].getCenter() - gameBall.y);
    var aiPaddleNoise = 8;
    var paddleTop = this.paddles[1].getTop();
    var paddleBottom = this.paddles[1].getBottom();
    var paddleCenter = Math.abs(this.paddles[1].getCenter());
    
    if (paddleCenter > gameBall.y &&
        paddleTop > this.canvas.clientTop &&
        distanceFromCenter > aiPaddleNoise) {
        
        this.paddles[1].y -= this.difficulty.aiPaddleSpeed;
    }
    else if (paddleCenter < gameBall.y &&
             paddleBottom < this.canvas.clientHeight &&
             distanceFromCenter > aiPaddleNoise){
        
        this.paddles[1].y += this.difficulty.aiPaddleSpeed;
    }
};