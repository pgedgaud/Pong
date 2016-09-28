var game = null;
var cbxPlayers = null;
var cbxDifficulty = null;
var txtPlayTo = null;
var btnPlay = null;
var btnStop = null;
var btnPause = null;
var btnResume = null;

window.onload = function() {
    var canvas = document.getElementById("canvas");
    var gameSettings = new GameSettings();
    gameSettings.maxGoals = 10;
    gameSettings.difficultySetting = "medium";
    game = new Game(canvas);

    cbxPlayers = document.getElementById("cbxPlayers");
    cbxDifficulty = document.getElementById("cbxDifficulty");
    txtPlayTo = document.getElementById("txtPlayTo");
    btnPlay = document.getElementById("btnPlay");
    btnStop = document.getElementById("btnStop");
    btnPause = document.getElementById("btnPause");
    btnResume = document.getElementById("btnResume");

    btnPlay.addEventListener("click", startGame, false);
    btnStop.addEventListener("click", stopGame, false);
    btnPause.addEventListener("click", pauseGame, false);
    btnResume.addEventListener("click", resumeGame, false);

    btnResume.style.display = "none";

    game.drawTitleScreen();
    game.onGameEnded = function() {
        btnPlay.disabled = false;
        btnPause.disabled = true;
        btnPause.style.display = "";
        btnResume.disabled = true;
        btnResume.style.display = "none";
        btnStop.disabled = true;
        disableForm(false);
    };
    game.onGameStarted = function() {
        btnPause.disabled = false;
        btnStop.disabled = false;
        btnPlay.disabled = true;
        btnResume.disabled = true;

        disableForm(true);
    }
    game.onGamePaused = function() {
        btnPause.style.display = "none";
        btnResume.style.display = "";
        btnResume.disabled = false;
    }
    game.onGameResumed = function() {
        btnResume.style.display = "none";
        btnPause.style.display = "";
    }
};

window.onblur = function() {
    pauseGame();
};

window.onfocus = function() {
    resumeGame();
};

function startGame() {
    var canvas = document.getElementById("canvas");
    var playerCount = parseInt(cbxPlayers.options[cbxPlayers.selectedIndex].value);
    var difficulty = cbxDifficulty.options[cbxDifficulty.selectedIndex].value;
    var playTo = parseInt(txtPlayTo.value);
    var gameSettings = new GameSettings();
    gameSettings.maxGoals = playTo;
    gameSettings.difficultySetting = difficulty;
    gameSettings.players = playerCount;
    game.start(gameSettings);
}

function stopGame() {
    game.endGame();
    game.drawTitleScreen();
}

function pauseGame() {
    if (!game.isPaused && game.gameLoop.isRunning) {
        game.pauseGame();
    }
}

function resumeGame() {
    if (game.isPaused) {
        game.resumeGame();
    }
}

function disableForm(isDisabled) {
    txtPlayTo.disabled = isDisabled;
    cbxPlayers.disabled = isDisabled;
    cbxDifficulty.disabled = isDisabled;
}