var InputTypes = {
    Keyboard: 0,
    Mouse: 1
};

function Input(type, canvas) {
    this.canvas = canvas;
    this.inputType = type;
}