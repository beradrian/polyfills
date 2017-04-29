var Shim = require("./shim.js");

Shim.prefixProperty(window, "requestFileSystem");
Shim.prefixProperty(window, "resolveLocalFileSystemURL");
