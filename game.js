var Game = function(canvas) {
    this.isPaused = false;
    this.onGameEnded = null;
    this.onGameStarted = null;
    this.onGamePaused = null;
    this.onGameResumed = null;
    this.matchStartXVelocity = STARTING_X_VELOCITY;
    this.lastFrameRenderTime = null;
    this.sounds = null;
    this.gameSettings = null;
    this.gameLoop = null;
    this.canvas = canvas;
    this.canvasContext = canvas.getContext("2d");
    this.input = new Input(InputTypes.keyboard);
    this.paddles = [];
    this.gameBall = null;
    this.isBallInGoal = false;
    this.hasPlayerWon = false;
    this.lastPaddleHit = -1;
    this.score = {
        1: 0,
        2: 0
    };
    this.difficulty = "";
    this.maxGoals = 0;
    
    this.initializeSound();
    this.initializeLoop();
    this.initializeCanvas();
    
    this.sounds.background.play();
    
    this.isFunction = function(func) {
        var getType = {};
        return func && getType.toString.call(func) === "[object Function]";
    };
};

Game.prototype.initializeSound = function() {
    this.sounds = {
        ballHitsWall: new Howl({
            src: ["sounds/ball_hits_wall.wav"]
        }),
        paddleOneHit: new Howl({
            src: ["sounds/paddle_one_hit.wav"]
        }),
        paddleTwoHit: new Howl({
            src: ["sounds/paddle_two_hit.wav"]
        }),
        background: new Howl({
            src: ["sounds/background.mp3"],
            loop: true,
            volume: 0.30
        })
    };
}

Game.prototype.initializeLoop = function() {
    var self = this;
    this.gameLoop = new GameLoop();
    this.gameLoop.onEachIteration = function(time) {
        var currentTime = time || new Date().getTime();
        if (self.lastFrameRenderTime == null) {
            self.lastFrameRenderTime = currentTime;
        }
        
        if (!self.gameLoop.isRunning) {
            self.lastFrameRenderTime = currentTime;
            return;
        }
        
        var deltaTime = currentTime - self.lastFrameRenderTime;
        self.update(deltaTime);
        if (self.hasPlayerWon) {
            self.endGame();
            return;
        }
        self.drawObjects();
        self.lastFrameRenderTime = currentTime;
    };
};

Game.prototype.initializeCanvas = function() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.fillStyle = "black";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.font = "40px Courier New";
};

Game.prototype.drawNet = function() {
    for (var i = 0; i < this.canvas.clientHeight; i += 40) {
        this.canvasContext.fillStyle = "white";
        this.canvasContext.fillRect(
            this.canvas.clientWidth / 2 - 1,
            i,
            2,
            20
        );
    }
};

Game.prototype.start = function(settings) {
    this.hasPlayerWon = false;
    this.lastPaddleHit = -1;
    this.gameSettings = settings;
    this.difficulty = this.gameSettings.difficulty[settings.difficultySetting];
    this.maxGoals = settings.maxGoals;
    this.score = {
        1: 0,
        2: 0
    };
    
    this.initializeCanvas();
    this.initializeObjects();
    this.gameLoop.start();
    
    if (this.isFunction && this.isFunction(this.onGameStarted)) {
        this.onGameStarted();
    }
};

Game.prototype.pauseGame = function() {
    this.gameLoop.isRunning = false;
    this.isPaused = true;
    if (this.isFunction && this.isFunction(this.onGamePaused)) {
        this.onGamePaused();
    }
};

Game.prototype.resumeGame = function() {
    this.gameLoop.isRunning = true;
    this.isPaused = false;
    if (this.isFunction && this.isFunction(this.onGameResumed)) {
        this.onGameResumed();
    }
};

Game.prototype.endGame = function() {
    this.gameLoop.stop();
    this.hasPlayerWon = true;
    this.paddles = [];
    this.lastFrameRenderTime = null;
    this.drawPlayerWonScreen();
    this.gameBall = null;
    this.isBallInGoal = false;
    if (this.isFunction && this.isFunction(this.onGameEnded)) {
        this.onGameEnded();
    }
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
    firstPaddle.setWidth(5);
    firstPaddle.setHeight(75);
    firstPaddle.backgroundColor = "#FF8484";

    this.paddles.push(firstPaddle);

    var secondPaddle = new Paddle();
    secondPaddle.x = this.canvas.width - 75;
    secondPaddle.setWidth(5);
    secondPaddle.setHeight(75);
    secondPaddle.backgroundColor = "#FF8484";

    this.paddles.push(secondPaddle);

    for (var i = 0; i < this.paddles.length; i ++) {
        this.paddles[i].y = (this.canvas.height / 2) - (this.paddles[i].getHeight() / 2);
    }

    this.gameBall = new Ball();
    this.gameBall.x = this.canvas.width / 2;
    this.gameBall.y = this.canvas.height / 2;
    this.gameBall.backgroundColor = "#84EBFF";
    this.gameBall.setRadius(5);
    this.gameBall.endAngle = 0;
    this.gameBall.xVelocity = STARTING_X_VELOCITY;
    this.gameBall.yVelocity = STARTING_Y_VELOCITY;
};

Game.prototype.reset = function() {
    this.matchStartXVelocity = -this.matchStartXVelocity;
    this.gameBall.x = this.canvas.width / 2;
    this.gameBall.y = this.canvas.height / 2;
    this.gameBall.xVelocity = this.matchStartXVelocity;
    this.gameBall.yVelocity = STARTING_Y_VELOCITY;
    this.isBallInGoal = false;
    this.lastPaddleHit = -1;
};

Game.prototype.drawObjects = function() {
    this.initializeCanvas();
    this.drawNet();
    this.canvasContext.fillStyle = "#FFFFFF";
    this.drawScoreInformation();
    
    for (var i = 0; i < this.paddles.length; i++) {
        this.canvasContext.fillStyle = this.paddles[i].backgroundColor;
        this.canvasContext.fillRect(
            this.paddles[i].x,
            this.paddles[i].y,
            this.paddles[i].getWidth(),
            this.paddles[i].getHeight()
        );
    }

    this.canvasContext.fillStyle = this.gameBall.backgroundColor;
    this.canvasContext.beginPath();
    this.canvasContext.arc(
        this.gameBall.x,
        this.gameBall.y,
        this.gameBall.getRadius(),
        this.gameBall.endAngle,
        Math.PI * 2,
        true
    );
    this.canvasContext.closePath();
    this.canvasContext.fill();
    
};

Game.prototype.drawScoreInformation = function() {
    var canvasMiddleX = this.canvas.clientWidth / 2;
    var playerOneScoreX = canvasMiddleX - 50;
    var playerTwoScoreX = canvasMiddleX + 50;
    this.canvasContext.fillText(this.score[1], playerOneScoreX, 50);
    this.canvasContext.fillText(this.score[2], playerTwoScoreX, 50);
};

Game.prototype.processInput = function(deltaTime) {
    if (this.gameSettings.players == 2) {
        if (this.input.keysPressed[KeyCodes.up] &&
            this.paddles[1].getTop() > this.canvas.clientTop) {
            this.paddles[1].moveUp(PADDLE_SPEED, deltaTime);
        }
        if (this.input.keysPressed[KeyCodes.down] &&
            this.paddles[1].getBottom() < this.canvas.clientHeight) {
            this.paddles[1].moveDown(PADDLE_SPEED, deltaTime);
        }
    }
    
    if (this.input.keysPressed[KeyCodes.w] &&
        this.paddles[0].getTop() > this.canvas.clientTop) {
        
        this.paddles[0].moveUp(PADDLE_SPEED, deltaTime);
    }
    if (this.input.keysPressed[KeyCodes.s] &&
        this.paddles[0].getBottom() < this.canvas.clientHeight) {
        this.paddles[0].moveDown(PADDLE_SPEED, deltaTime);
    }
};

Game.prototype.drawPlayerWonScreen = function() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.fillStyle = "#000000";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    var msg = "";
    for (var index in this.score) {
        if (this.score.hasOwnProperty(index) &&
            this.score[index] == this.maxGoals) {
            
            msg = "Player " + index + " has won!";
        }
    }
    
    this.canvasContext.textAlign = "center";
    this.canvasContext.fillStyle = "#FFFFFF";
    var centerX = this.canvas.clientWidth / 2;
    var centerY = this.canvas.clientHeight / 2;
    this.canvasContext.fillText(msg, centerX, centerY);
};

Game.prototype.drawTitleScreen = function() {
    this.canvasContext.textAlign = "center";
    this.canvasContext.fillStyle = "#9090FF";
    this.canvasContext.fillText("RETRO TENNIS", this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
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

Game.prototype.update = function(deltaTime) {
    this.processInput(deltaTime);
    
    if (this.gameSettings.players == 1) {
        this.calculateAi(this.gameBall, deltaTime);
    }
    
    var collisionInfo = this.gameBall.checkCollisionsWith(this.paddles, this.canvas);
    this.gameBall.updatePosition(deltaTime);
    
    this.playSounds(collisionInfo);
    this.isBallInGoal = collisionInfo.isBallInGoal;
    if (collisionInfo.isBallInGoal) {
        this.score[collisionInfo.playerScored]++;
        if (this.score[collisionInfo.playerScored] == this.maxGoals) {
            this.endGame();
            return;
        }
        this.reset();
    }
    /* This is wrap-around code!
    if (gameBall.x > canvas.width) {
        gameBall.x -= gameBall.x;
    }
    */
};

Game.prototype.calculateAi = function(gameBall, deltaTime) {
    var distanceFromCenter = Math.abs(this.paddles[1].getCenter() - gameBall.y);
    var aiPaddleNoise = 10;
    var paddleTop = this.paddles[1].getTop();
    var paddleBottom = this.paddles[1].getBottom();
    var paddleCenter = Math.abs(this.paddles[1].getCenter());
    var acceleration = 1.0;
    
    if (distanceFromCenter > aiPaddleNoise &&
        distanceFromCenter > this.paddles[1].getHeight() / 2) {
        acceleration = this.difficulty.aiAcceleration;
    }
    
    if (paddleCenter > gameBall.y &&
        paddleTop > this.canvas.clientTop &&
        distanceFromCenter > aiPaddleNoise) {
        
        this.paddles[1].moveUp(this.difficulty.aiPaddleSpeed * acceleration, deltaTime);
    }
    else if (paddleCenter < gameBall.y &&
             paddleBottom < this.canvas.clientHeight &&
             distanceFromCenter > aiPaddleNoise){
        
        this.paddles[1].moveDown(this.difficulty.aiPaddleSpeed * acceleration, deltaTime);
    }
};

Game.prototype.muteMusic = function() {
    this.sounds.background.pause();
    
}