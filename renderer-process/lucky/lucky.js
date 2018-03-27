window.$ = window.jQuery = require('jquery');
window.Tether = require('tether');
window.Bootstrap = require('bootstrap');

require('jquery-easing');

const User = require('./user');

const HIT_SPEED = 100;
const RIGIDITY = 4;

module.exports = {

	users: [],

	init: function (data) {
		window.$('#container').css('background', 'none');

		this.data = data;
		this.users = data.map(function (name) {
			return new User(name, data[name]);
		});

		this._bindUI();
	},

	_bindUI: function () {
		let that = this;

		// bind button
		let trigger = document.querySelector('#go');
		trigger.innerHTML = trigger.getAttribute('data-text-start');
		trigger.addEventListener('click', go);

		function go() {
			if (trigger.getAttribute('data-action') === 'start') {
				trigger.setAttribute('data-action', 'stop');
				trigger.innerHTML = trigger.getAttribute('data-text-stop');
				that.start();
			}
			else {
				trigger.setAttribute('data-action', 'start');
				trigger.innerHTML = trigger.getAttribute('data-text-start');
				that.stop();
			}
		}

		// bind #lucky-balls
		window.$('#lucky-balls').on('click', 'li', function (e) {
			let el = window.$(e.target);
			let name = el.text();

			that.addItem(name);
			if (trigger.getAttribute('data-action') === 'start') {
				that.hit();
			}
			el.remove();
		});

		// bind #balls
		window.$('#balls').on('click', 'li', function (e) {
			let el = window.$(e.target);
			let name = el.text();

			for (let i = 0; i < that.users.length; i++) {
				let user = that.users[i];

				if (user.name === name) {
					if (!that.moveLucky() && that.luckyUser !== user) {
						trigger.setAttribute('data-action', 'start');
						trigger.innerHTML = trigger.getAttribute('data-text-start');
						that.setLucky(user);
					}
					break;
				}
			}
		});

		// bind keydown
		document.addEventListener('keydown', function (ev) {
			if (ev.keyCode === '32') {
				go();
			}
			else if (ev.keyCode == '27') {
				that.moveLucky();
				window.$('#lucky-balls li').eq(0).click();
			}
		}, false);

	},

	start: function () {
		this.timer && clearTimeout(this.timer);
		this.moveLucky();

		this.users.forEach(function (user) {
			user.start();
		});
	},

	stop: function () {
		let users = this.users;
		let z = 0, lucky = users[0];

		users.forEach(function (user) {
			user.stop();
			if (z < user.zIndex) {
				lucky = user;
				z = user.zIndex;
			}
		});

		lucky.bang();
		this.hit();
		this.luckyUser = lucky;
	},

	removeItem: function (item) {
		for (let i = 0; i < this.users.length; i++) {
			let user = this.users[i];
			if (user === item) {
				this.users.splice(i, 1);
			}
		}
	},

	addItem: function (name) {
		this.users.push(new User(name));
	},

	moveLucky: function () {
		let luckyUser = this.luckyUser;
		if (luckyUser) {
			luckyUser.el[0].style.cssText = '';
			luckyUser.el.prependTo('#lucky-balls');
			this.removeItem(luckyUser);
			this.luckyUser = null;
			return true;
		} else {
			return false;
		}
	},

	setLucky: function (item) {
		this.users.forEach(function (user) {
			user.stop();
		});
		this.luckyUser = item;
		item.bang();
		this.hit();
	},

	hit: function () {
		let that = this;
		let hitCount = 0;
		let users = this.users;

		users.forEach(function (user) {
			user.beginHit();
		});

		for (let i = 0; i < users.length; i++) {
			for (let j = i + 1; j < users.length; j++) {
				if (isOverlap(users[i], users[j])) {
					hit(users[i], users[j]);
					hitCount++;
				}
			}
		}

		users.forEach(function (user) {
			user.hitMove();
		});

		if (hitCount > 0) {
			this.timer && clearTimeout(this.timer);
			this.timer = setTimeout(function () {
				that.hit();
			}, HIT_SPEED);
		}
	}
};


// Helpers

function getOffset(a, b) {
	return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function isOverlap(a, b) {
	return getOffset(a, b) <= (a.width + b.width) / 2;
}

function hit(a, b) {
	let yOffset = b.y - a.y;
	let xOffset = b.x - a.x;

	let offset = getOffset(a, b);

	let power = Math.ceil(((a.width + b.width) / 2 - offset) / RIGIDITY);
	let yStep = yOffset > 0 ? Math.ceil(power * yOffset / offset) : Math.floor(power * yOffset / offset);
	let xStep = xOffset > 0 ? Math.ceil(power * xOffset / offset) : Math.floor(power * xOffset / offset);

	if (a.lucky) {
		b._xMove += xStep * 2;
		b._yMove += yStep * 2;
	}
	else if (b.lucky) {
		a._xMove += xStep * -2;
		a._yMove += yStep * -2;
	}
	else {
		a._yMove += -1 * yStep;
		b._yMove += yStep;

		a._xMove += -1 * xStep;
		b._xMove += xStep;
	}
}