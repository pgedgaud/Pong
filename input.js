var InputTypes = {
    keyboard: 0,
    mouse: 1
};

var KeyCodes = {
    up: 38,
    down: 40,
    w: 87,
    s: 83
};

function Input(type, canvas) {
    this.canvas = canvas;
    this.inputType = type;
    this.keysPressed = {};
    this.keysPressed.up = 38;
    this.keysPressed.down = 40;
    
    switch (this.inputType) {
        case InputTypes.keyboard:
            // I'm adding the event listener to the "view" object so 'this' scoping works.
            this.view.addEventListener("keydown", this.onKeyPressed.bind(this), false);
            this.view.addEventListener("keyup", this.onKeyPressed.bind(this), false);
            break;
        case InputTypes.mouse:
            this.canvas.addEventListener("mousemove", this.mouseMoved.bind(this), false);
            break;
        default:
            console.error("'" + type + "' not a supported input type.");
            break;
    }
}

Input.prototype.view = window;

Input.prototype.onKeyPressed = function(evt) {
    var keyCode = evt.keyCode || evt.which;
    this.keysPressed[keyCode] = evt.type == "keydown";
};

Input.prototype.mouseMoved = function(evt) {
    var rootElement = document.documentElement;
    var boundingRectangle = this.canvas.getBoundingClientRect();
    var yCoordinate = evt.clientY - boundingRectangle.top - rootElement.scrollTop;
    this.onMouseMoved(yCoordinate);
};

Input.prototype.onMouseMoved = function(yCoordinate) {};