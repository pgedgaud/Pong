var InputTypes = {
    keyboard: 0,
    mouse: 1
};

function Input(type) {
    this.canvas = canvas;
    this.inputType = type;
    this.keyCodes = {};
    this.keyCodes.up = 38;
    this.keyCodes.down = 40;
    
    switch (this.inputType) {
        case InputTypes.keyboard:
            this.view.addEventListener("keydown", this.onKeyPressed.bind(this), false);
            this.view.addEventListener("keyup", this.onKeyPressed.bind(this), false);
            break;
        default:
            console.error("'" + type + "' not a supported input type.");
            break;
    }
}

Input.prototype.view = window;

Input.prototype.onKeyPressed = function(evt) {
    var keyCode = evt.keyCode || evt.which;
    this.keyCodes[keyCode] = evt.type == "keydown";
};