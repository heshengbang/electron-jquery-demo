const Backbone = require('backbone');
const toDo = require('../collections/todos');
const common = require('../common');

const Workspace = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
	},

	setFilter: function (param) {
		// Set the current filter to be used
		common.TodoFilter = param && param.trim() || '';

		// Trigger a collection filter event, causing hiding/unhiding
		// of view items
		toDo.trigger('filter');
	}
});

module.exports = Workspace;