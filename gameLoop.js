/*
 *  The purpose of the GameLoop object is to abstract requestAnimationFrame
 *  so the game only has to run inside of onEachIteration and not have to worry
 *  about which browser implementation it is using.
 */
function GameLoop() {
    this.onEachIteration = null;
    this.requestId = null;
    this.isRunning = true;
    this.requestAnimationFrame = window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.requestAnimationFrame;
    
    /*
    if (window.webkitRequestionAnimationFrame) {
        var that = this;
        this.onEachIteration = function(callback) {
            var _callback = function() {
                callback();
                that.requestId = webkitRequestAnimationFrame(_callback);
            };
            _callback();
        };
    }
    else if (window.requestAnimationFrame) {
        var that = this;
        this.onEachIteration = function(callback) {
            var _callback = function() {
                callback();
                that.requestId = requestAnimationFrame(_callback);
            };
            _callback();
        };
    }
    else if (window.mozRequestAnimationFrame) {
        var that = this;
        this.onEachIteration = function(callback) {
            var _callback = function() {
                callback();
                that.requestId = mozRequestAnimationFrame(_callback);
            };
            _callback();
        };
    }
    else {
        var that = this;
        this.onEachIteration = function(callback) {
            that.requestId = setInterval(callback, 1000 / 60);
        };
    }
    */
}

GameLoop.prototype.start = function() {
    this.isRunning = true;
    var self = this;
    var _callback = function() {
        self.onEachIteration();
        self.requestId = self.requestAnimationFrame.call(window, _callback);
    };
    _callback();
};

GameLoop.prototype.stop = function() {
    var cancelAnimationFrame = window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitAnimationFrame ||
        window.cancelAnimationFrame;
    
    if (this.requestId) {
        cancelAnimationFrame(this.requestId);
        this.onEachIteration = null;
        this.requestId = null;
        this.isRunning = false;
    }
}