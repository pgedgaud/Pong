// constants
const STARTING_Y_VELOCITY = 2;

function GameSettings() {
    this.maxGoals = 0;
    this.difficultySetting = "";
    this.difficulty = {
        easy: {
            label: "Easy",
            ballXVelocity: 5,
            ballYVelocity: 3,
            aiPaddleSpeed: 4
        },
        medium: {
            label: "Medium",
            ballXVelocity: 5.5,
            ballYVelocity: 3.5,
            aiPaddleSpeed: 6
        },
        hard: {
            label: "Hard",
            ballXVelocity: 5.75,
            ballYVelocity: 3.75,
            aiPaddleSpeed: 8
        }
    }
}

function GameObject() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.backgroundColor = "";
}

GameObject.prototype.update;

function Ball() {
    this.radius = 0;
    this.endAngle = 0;
    this.xVelocity = 0;
    this.yVelocity = 0;
}
Ball.prototype.constructor = GameObject;

Ball.prototype.updatePosition = function() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
};

Ball.prototype.checkCollisionsWith = function(paddles, canvas) {
    var lastPaddleHit = -1;
    var isBallInGoal = false;
    var isWallHit = false;
    
    if (this.x == paddles[0].x + paddles[0].thickness) {
        if (this.y > paddles[0].y &&
            this.y < (paddles[0].y + paddles[0].height)) {
            
            this.xVelocity = -this.xVelocity;
            
            var deltaY = this.y - (paddles[0].y + paddles[0].height / 2);
            this.yVelocity = deltaY * 0.35;
            lastPaddleHit = 1;
        }
    }
    else if (this.x == paddles[1].x - paddles[1].thickness) {
        if (this.y > paddles[1].y &&
            this.y < (paddles[1].y + paddles[1].height)) {
            
            this.xVelocity = -(this.xVelocity);
            var deltaY = this.y - (paddles[1].y + paddles[1].height / 2);
            this.yVelocity = deltaY * 0.35;
            lastPaddleHit = 2;
        }
    }

    if (this.y + this.radius > canvas.height ||
        this.y - this.radius < 0) {
        this.yVelocity = -this.yVelocity;
        isWallHit = true;
    }
    
    if (this.x < canvas.clientLeft ||
        this.x > canvas.clientWidth) {
        
        isBallInGoal = true;
    }
    
    return {
        isBallInGoal: isBallInGoal,
        lastPaddleHit: lastPaddleHit,
        isWallHit: isWallHit
    };
};

function Paddle() {
    this.thickness = 0;
}
Paddle.prototype.constructor = GameObject;

Paddle.prototype.getCenter = function() {
    return this.y + (this.height / 2);
};

