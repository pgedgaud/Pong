/*
 *  The purpose of the GameLoop object is to abstract requestAnimationFrame
 *  so the game only has to run inside of onEachIteration and not have to worry
 *  about which browser implementation it is using.
 */
function GameLoop() {
    this.onEachIteration = null;
    this.requestId = null;
    this.isRunning = false;
    this.callback = null;
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.requestAnimationFrame;
}

GameLoop.prototype.start = function() {
    this.isRunning = true;
    var self = this;
    this.callback = function(time) {
        if (self.onEachIteration) {
            self.onEachIteration(time);
            self.requestId = window.requestAnimationFrame(self.callback);
        }
    };
    this.callback();
};

GameLoop.prototype.stop = function() {
    var cancelAnimationFrame = window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitAnimationFrame ||
        window.cancelAnimationFrame;
    
    if (this.requestId) {
        cancelAnimationFrame(this.requestId);
        this.requestId = null;
        this.isRunning = false;
        this.callback = null;
    }
}