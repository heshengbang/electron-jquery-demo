let store = require('store');

module.exports = function () {
	let todos = [];

	if (store.enabled) {
		todos = store.get('todos') || store.set('todos', todos);
	}

	return {
		getTodos: function (filter) {
			if (filter) {
				return todos.filter(function (todo) {
					if (filter.completed === '') return true;
					return todo.completed === filter.completed;
				});
			} else {
				return todos;
			}
		},

		addTodo: function (todo) {
			todos.push({
				title: todo,
				completed: false
			});
		},

		delTodo: function (index) {
			todos.splice(index, 1);
		},

		clearCompleted: function () {
			for (let i = todos.length - 1; i > -1; i--) {
				if (todos[i].completed) {
					this.delTodo(i);
				}
			}
		},
		store: function () {
			store.set('todos', todos);
		}
	};
};
