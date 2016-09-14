// constants
const STARTING_Y_VELOCITY = 4;
const STARTING_X_VELOCITY = 8;

function GameSettings() {
    this.maxGoals = 0;
    this.players = 1;
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
    this.scale = 2.0;
}

GameObject.prototype.getScale = function() {
    return this.scale;
};

GameObject.prototype.setScale = function(newScale) {
    if (this.scale != newScale) {
        this.scale = newScale;
    }
};

GameObject.prototype.getWidth = function() {
    return this.width * this.scale;
};

GameObject.prototype.setWidth = function(newWidth) {
    if (this.width != newWidth) {
        this.width = newWidth;
    }
};

GameObject.prototype.getHeight = function() {
    return this.height * this.scale;
};

GameObject.prototype.setHeight = function(newHeight) {
    if (this.height != newHeight) {
        this.height = newHeight;
    }
};

GameObject.prototype.update;

function Ball() {
    this.radius = 0;
    this.endAngle = 0;
    this.xVelocity = 0;
    this.yVelocity = 0;
    GameObject.call(this);
}

Ball.prototype = GameObject.prototype;
Ball.prototype.constructor = GameObject;

Ball.prototype.updatePosition = function() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
};

Ball.prototype.setRadius = function(newRadius) {
    if (this.radius != newRadius) {
        this.radius = newRadius;
    }
};

Ball.prototype.getRadius = function() {
    return this.radius * this.getScale();
};

Ball.prototype.checkCollisionsWith = function(paddles, canvas) {
    var isBallInGoal = false;
    var playerScored = -1;
    var lastPaddleHit = -1;
    var isWallHit = false;
    
    if (this.x - this.getRadius() <= paddles[0].x + paddles[0].getWidth()) {
        if (this.y > paddles[0].y + paddles[0].getWidth() &&
            this.y < (paddles[0].y + paddles[0].getHeight())) {
            
            this.xVelocity = -this.xVelocity;
            
            var deltaY = this.y - (paddles[0].y + paddles[0].getHeight() / 2);
            this.yVelocity = deltaY * 0.35;
            lastPaddleHit = 1;
        }
    }
    else if (this.x + this.getRadius() >= paddles[1].x - paddles[1].getWidth()) {
        if (this.y > paddles[1].y &&
            this.y < (paddles[1].y + paddles[1].getHeight())) {
            
            this.xVelocity = -(this.xVelocity);
            var deltaY = this.y - (paddles[1].y + paddles[1].getHeight() / 2);
            this.yVelocity = deltaY * 0.35;
            lastPaddleHit = 2;
        }
    }

    if (this.y + this.getRadius() > canvas.height ||
        this.y - this.getRadius() < 0) {
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
    GameObject.call(this);
}

Paddle.prototype = GameObject.prototype;
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
    return this.y * this.scale;
}

Paddle.prototype.getBottom = function() {
    return this.y + this.getHeight();
}