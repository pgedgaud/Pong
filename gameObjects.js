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

Ball.prototype.update = function() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;
};

function Paddle() {
    this.thickness = 0;
}
Paddle.prototype.constructor = GameObject;
