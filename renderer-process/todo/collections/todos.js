const Backbone = require('backbone');
require('backbone.localstorage');

window.$ = window.jQuery = require('jquery');

const TodoModel = require('../models/todo');

const TodosCollection = Backbone.Collection.extend({
	model: TodoModel,

	localStorage: new Backbone.LocalStorage('todos-backbone'),

	completed: function () {
		return this.filter(function (todo) {
			return todo.get('completed');
		});
	},

	remaining: function () {
		return this.without.apply(this, this.completed());
	},

	nextOrder: function () {
		if (!this.length) {
			return 1;
		}
		return this.last().get('order') + 1;
	},

	comparator: function (todo) {
		return todo.get('order');
	}
});

module.exports = new TodosCollection();