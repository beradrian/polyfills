var PREFIXES = ["webkit", "_webkit", "moz", "_moz", "ms", "_ms"];

module.exports = {

	prefixProperty : function(object, property, prefixes) {
		prefixes = prefixes || PREFIXES;
		if (!object[property]) {
			var p = property[0].toUpperCase() + property.substring(1);
			for (var i = 0, n = PREFIXES.length; i < n; i++) {
				if (object[PREFIXES[i] + p]) {
					object[property] = object[PREFIXES[i] + p];
					break;
				}
			}
		}
		return object[property];
	}

};
