var Shim = require("./shim.js");

document.documentElement._webkitRequestFullscreen = function() {
	document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
}
Shim.prefixProperty(document.documentElement, "requestFullscreen");
Shim.prefixProperty(document.documentElement, "requestFullScreen");
document.requestFullscreen = document.requestFullScreen = document.requestFullscreen || document.requestFullScreen;
Shim.prefixProperty(document, "exitFullscreen");
Shim.prefixProperty(document, "exitFullScreen");
document.exitFullscreen = document.exitFullScreen = document.exitFullscreen || document.exitFullScreen;

var isInFullScreen = function() {
	return !(!document.fullscreenElement // alternative standard method
			&& !document.mozFullScreenElement
			&& !document.webkitFullscreenElement
			&& !document.msFullscreenElement );
};

module.exports = {
	isIn: isInFullScreen,
	isEnabled: isInFullScreen,
	toggle: function() {
		if (!isInFullScreen()) { // current working methods
			document.documentElement.requestFullScreen();
	} else {
		document.exitFullScreen();
	}
}
