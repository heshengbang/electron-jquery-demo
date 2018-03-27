var Spinning = require('./spinning');

var s = new Spinning('#container');
s.render();

window.$('#back').click(function () {
	window.console.log('click');
});