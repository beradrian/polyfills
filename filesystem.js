var Shim = require("./shim.js");

Shim.prefixProperty(window, "requestQuota");
Shim.prefixProperty(window, "requestFileSystem");
Shim.prefixProperty(window, "resolveLocalFileSystemURL");

if (!window.LocalFileSystem) {
	window.LocalFileSystem = window;
}
