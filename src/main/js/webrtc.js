var Shim = require("./shim.js");

Shim.prefixProperty(window, "RTCPeerConnection");
Shim.prefixProperty(window, "RTCIceCandidate");
Shim.prefixProperty(window, "RTCSessionDescription");
Shim.prefixProperty(navigator, "getUserMedia");
Shim.prefixProperty(window, "URL");
Shim.prefixProperty(window, "AudioContext");

if (window.AudioContext) {
	for (var p in AudioContext.prototype) {
		var idx = p.indexOf("Node");
		if (idx > 0 && idx + 4 === p.length) {
			var newp = p.substring(0, idx);
			if (!AudioContext.prototype[newp]) {
				AudioContext.prototype[newp] = AudioContext.prototype[p];
			}
		}
	}
}

if (!navigator.mediaDevices) {
	navigator.mediaDevices = {};
}

if ((!navigator.mediaDevices.enumerateDevices) && (window.MediaStreamTrack && window.MediaStreamTrack.getSources)) {
	navigator.mediaDevices.enumerateDevices = function() {
			var p = new Promise(function(resolve, reject) {
				MediaStreamTrack.getSources(function (devices) {
					resolve(devices);
				});
			});
			return p;
		};
}

if (!navigator.mediaDevices.getUserMedia) {
	Shim.prefixProperty(navigator.mediaDevices, "getUserMedia");
	if (!navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia = navigator.getUserMedia;
	}
}

/** A map between the statistic Chrome proprietary name and W3C standard name. */
var TRANSLATED_REPORT_NAMES = {"rtt" : "roundtriptime", "audioInputLevel": "audioLevel"};

/** Translate a proprietary statistic name to a standard one. E.g. remove goog or webkit prefixes. */
var getTranslatedStatisticName = function(name) {
	var translatedName = name;
	if (name.indexOf("goog") === 0) {
		translatedName = name[4].toLowerCase() + name.substring(5);
	}
	if (name.indexOf("webkit") === 0) {
		translatedName = name[6].toLowerCase() + name.substring(7);
	}
	if (TRANSLATED_REPORT_NAMES[translatedName]) {
		translatedName = TRANSLATED_REPORT_NAMES[translatedName];
	}
	return translatedName;
};

var createHasPropertiesCallback = function(properties) {
	return function(element, index, array) {
		for (var p in  properties) {
			if (element[p] != properties[p]) {
				return false;
			}
		}
		return true;
	};
};

if (navigator.webkitGetUserMedia) {
	// Try to make the getStats method in Chrome as close to the standard as possible
	RTCPeerConnection.prototype._getStats = RTCPeerConnection.prototype.getStats;
	RTCPeerConnection.prototype.getStats = function (selector) {
		var pc = this;
		return new Promise(function(resolve, reject) {
			pc._getStats(function(response) {
				var standardReport = {}, ssrc = [];
				response.result().forEach(function(report) {
					var standardStats = {
						id: report.id,
						type: report.type
					};
					// translate the statistics name to a standard one (@see getTranslatedStatisticName())
					report.names().forEach(function(name) {
						standardStats[name] = report.stat(name);
						var translatedName = getTranslatedStatisticName(name);
						if (translatedName != name) {
							standardStats[translatedName] = standardStats[name];
						}
					});
					// modify "ssrc" type 
					if (standardStats.type == "ssrc") {
						if (typeof standardStats.bytesSent != "undefined") {
							standardStats.webkitType = standardStats.type;
							standardStats.type = "outboundrtp";
						}
						if (typeof standardStats.bytesReceived != "undefined") {
							standardStats.webkitType = standardStats.type;
							standardStats.type = "inboundrtp";
						}
						ssrc.push(standardStats);
					}
					// add the statistics to the standard report
					standardReport[standardStats.id] = standardStats;
				});

				// create localId and remoteId for ssrc/inboundrtp/outboundrtp stats
				for (var i = 0, n = ssrc.length; i < n; i++) {
					var remote = ssrc.find(createHasPropertiesCallback({
							"type": ssrc[i].type == "outboundrtp" ? "inboundrtp" : "outboundrtp"
							, "transportId": ssrc[i].transportId
							, "codecName": ssrc[i].codecName
							}));
					if (typeof remote != "undefined") {
						ssrc[i][ssrc[i].type == "outboundrtp" ? "remoteId" : "localId"] = remote.id;
					}
				}

				// resolve the standard promise with the standard report
				resolve(standardReport);
			}, selector, reject);
		});
	};
}
