/*
 *  The purpose of the GameLoop object is to abstract requestAnimationFrame
 *  so the game only has to run inside of onEachIteration and not have to worry
 *  about which browser implementation it is using.
 */
function GameLoop() {
    this.onEachIteration = null;
    
    if (window.webkitRequestionAnimationFrame) {
        this.onEachIteration = function(callback) {
            var _callback = function() {
                callback();
                webkitRequestAnimationFrame(_callback);
            };
            _callback();
        };
    }
    else if (window.requestAnimationFrame) {
        this.onEachIteration = function(callback) {
            var _callback = function() {
                callback();
                requestAnimationFrame(_callback);
            };
            _callback();
        };
    }
    else if (window.mozRequestAnimationFrame) {
        this.onEachIteration = function(callback) {
            var _callback = function() {
                callback();
                mozRequestAnimationFrame(_callback);
            };
            _callback();
        };
    }
    else {
        this.onEachIteration = function(callback) {
            setInterval(callback, 1000 / 60);
        };
    }
}