// constants
const STARTING_Y_VELOCITY = 5;

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
    if (this.x < paddles[0].x + paddles[0].thickness) {
        if (this.y > paddles[0].y &&
            this.y < (paddles[0].y + paddles[0].height)) {

            this.xVelocity = -this.xVelocity;
            
            var deltaY = this.y - (paddles[0].y + paddles[0].height / 2);
            this.yVelocity = deltaY * 0.35;
            lastPaddleHit = 1;
        }
        if (this.x < canvas.clientLeft) {
            isBallInGoal = true;
        }
    }
    else if (this.x > paddles[1].x - paddles[1].thickness) {
        if (this.y > paddles[1].y &&
            this.y < (paddles[1].y + paddles[1].height)) {
            
            this.xVelocity = -(this.xVelocity);
            var deltaY = this.y - (paddles[1].y + paddles[1].height / 2);
            this.yVelocity = deltaY * 0.35;
            lastPaddleHit = 2;
        }
        if (this.x > canvas.clientWidth) {
            isBallInGoal = true;
        }
    }

    if (this.y > canvas.height || this.y < 0) {
        this.yVelocity = -this.yVelocity;
    }
    
    return {
        isBallInGoal: isBallInGoal,
        lastPaddleHit: lastPaddleHit
    };
};

function Paddle() {
    this.thickness = 0;
}
Paddle.prototype.constructor = GameObject;

Paddle.prototype.getCenter = function() {
    return this.y + (this.height / 2);
};