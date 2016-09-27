chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create("pong.html", {
        outerBounds: {
            width: 1270,
            height: 720
        }
    });
});