// Web Worker timer - not subject to background tab throttling
var timers = {};
var nextId = 1;

self.onmessage = function(e) {
	var msg = e.data;
	if (msg.action === 'set') {
		var id = nextId++;
		timers[id] = setTimeout(function() {
			delete timers[id];
			self.postMessage({ id: id, name: msg.name });
		}, msg.delay);
		self.postMessage({ id: id, name: msg.name, action: 'created' });
	} else if (msg.action === 'clear') {
		// Clear all timers with the given name
		for (var key in timers) {
			clearTimeout(timers[key]);
			delete timers[key];
		}
	}
};
