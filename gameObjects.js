const STARTING_Y_VELOCITY = 150; // 150
const STARTING_X_VELOCITY = 400; // 400
const PADDLE_SPEED = 300;

function GameSettings() {
    this.maxGoals = 0;
    this.players = 1;
    this.difficultySetting = "";
    this.difficulty = {
        easy: {
            label: "Easy",
            aiPaddleSpeed: PADDLE_SPEED,
            aiAcceleration: 2.25
        },
        medium: {
            label: "Medium",
            aiPaddleSpeed: PADDLE_SPEED * 1.25,
            aiAcceleration: 2.5
        },
        hard: {
            label: "Hard",
            aiPaddleSpeed: PADDLE_SPEED * 1.75,
            aiAcceleration: 2.75
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

/*
 * The X and Y coordinates coorespond to the middle of the circle.
 */
function Ball() {
    this.radius = 0;
    this.endAngle = 0;
    this.xVelocity = 0;
    this.yVelocity = 0;
    GameObject.call(this);
}

Ball.prototype = GameObject.prototype;
Ball.prototype.constructor = GameObject;

Ball.prototype.updatePosition = function(deltaTime) {
    this.x += this.xVelocity * (deltaTime / 1000);
    this.y += this.yVelocity * (deltaTime / 1000);
};

Ball.prototype.setRadius = function(newRadius) {
    if (this.radius != newRadius) {
        this.radius = newRadius;
    }
};

Ball.prototype.getRadius = function() {
    return this.radius * this.getScale();
};

Ball.prototype.isCollidingWith = function(paddle) {
    var distanceX = Math.abs(this.x - paddle.x - paddle.getWidth() / 2);
    var distanceY = Math.abs(this.y - paddle.y - paddle.getHeight() / 2);
    
    if (distanceX > paddle.getWidth() / 2 + this.getRadius()) {
        return false;
    }
    if (distanceY > paddle.getHeight() / 2 + this.getRadius()) {
        return false;
    }
    
    if (distanceX <= paddle.getWidth() / 2) {
        return true;
    }
    if (distanceY <= paddle.getHeight() / 2) {
        return true;
    }
    
    var dx = distanceX - paddle.getWidth() / 2;
    var dy = distanceY - paddle.getHeight() / 2;
    return ((dx * dx) + (dy * dy)) <= (this.getRadius() * this.getRadius());
};

//FIXME(Logan) => Collision is broken after first play.
Ball.prototype.checkCollisionsWith = function(paddles, canvas) {
    var isBallInGoal = false;
    var playerScored = -1;
    var lastPaddleHit = -1;
    var isWallHit = false;
    
    for (var i = 0; i < paddles.length; i++) {
        if (this.isCollidingWith(paddles[i])) {
            var currentXVelocity = this.xVelocity;
            var middleX = paddles[i].x + paddles[i].getWidth() / 2;
            var middleY = paddles[i].y + paddles[i].getHeight() / 2;
            if ((i == 0 && this.x > middleX) ||
                (i == 1 && this.x < middleX)) {
                
                this.xVelocity = -(this.xVelocity);
            }
            // this.xVelocity = -(this.xVelocity);
            var deltaY = this.y - (paddles[i].y + paddles[i].getHeight() / 2);
            this.yVelocity = deltaY * 10.35;
            
            switch (i) {
                case 0:
                    lastPaddleHit = 1;
                    break;
                case 1:
                    lastPaddleHit = 2;
            }
        }
    }
    
    if (this.y + this.getRadius() > canvas.height ||
        this.y - this.getRadius() < 0) {
        this.yVelocity = -this.yVelocity;
        isWallHit = true;
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

/*
 * The X and Y coordinates coorespond to the top-left part of the paddle.
 */
function Paddle() {
    this.thickness = 0;
    GameObject.call(this);
}

Paddle.prototype = GameObject.prototype;
Paddle.prototype.constructor = GameObject;

Paddle.prototype.getCenter = function() {
    return this.y + (this.height / 2);
};

Paddle.prototype.moveUp = function(pixels, deltaTime) {
    this.y -= pixels * (deltaTime / 1000);
};

Paddle.prototype.moveDown = function(pixels, deltaTime) {
    this.y += pixels * (deltaTime / 1000);
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