// constants
const STARTING_Y_VELOCITY = 2;
const STARTING_X_VELOCITY = 5;

function GameSettings() {
    this.maxGoals = 0;
    this.difficultySetting = "";
    this.difficulty = {
        easy: {
            label: "Easy",
            aiPaddleSpeed: 4
        },
        medium: {
            label: "Medium",
            aiPaddleSpeed: 6.5
        },
        hard: {
            label: "Hard",
            aiPaddleSpeed: 10
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
    var isBallInGoal = false;
    var playerScored = -1;
    var lastPaddleHit = -1;
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
    
    if (this.x < canvas.clientLeft) {
        isBallInGoal = true;
        playerScored = 2;
    }
    if (this.x > canvas.clientWidth) {
        isBallInGoal = true;
        playerScored = 1;
    }
    
    return {
        lastPaddleHit: lastPaddleHit,
        isBallInGoal: isBallInGoal,
        playerScored: playerScored,
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

Paddle.prototype.moveUp = function(pixels) {
    this.y -= pixels;
};

Paddle.prototype.moveDown = function(pixels) {
    this.y += pixels;
};

Paddle.prototype.moveTo = function(y) {
    this.y = y - this.height / 2;
}

Paddle.prototype.getTop = function() {
    return this.y;
}

Paddle.prototype.getBottom = function() {
    return this.y + this.height;
}