Project = Backbone.RelationalModel.extend({
  relations: [
    {
      type: Backbone.HasMany,
      key: 'tasks',
      relatedModel: 'Task',
      includeInJSON: Backbone.Model.prototype.idAttribute,
      collectionType: 'TaskCollection',
      reverseRelation: {
        key: 'project'
      }
    }
  ]
});

Task = Backbone.RelationalModel.extend({
  initialise: function() {
    // do whatever
  },
  
  clear: function() {
    this.destroy();
    this.view.remove();
  }
});

TaskCollection = Backbone.Collection.extend({
  model: Task,
  done: function() {
    return this.filter(function(task){ return task.get('done'); });
  },
  
  remaining: function() {
    return this.without.apply(this, this.done());
  },
  
  nextOrder: function() {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
  },
  
  comparator: function(task) {
    return task.get('order');
  },
  
  url: function( models ) {
    return '/project/' + (models ? 'set/' + _.pluck(models, 'id').join(';') + '/' : '');
  }
});


TaskView = Backbone.view.extend({
  tagName: "li",
  
  template: _.template("<div type='text' class='task-content'></div>"),
  
  initialize: function() {
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
    this.model.view = this;
  },
  
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    this.setContent();
    return this;
  },
  
  setContent: function() {
    var content = this.model.get('content');
    this.$('.task-content').text(content);
  },
  
  remove: function() {
    $(this.el).remove();
  },
  
  clear: function() {
    this.model.clear();
  }
});


AppView = Backbone.View.extend({

  el: $("tasksection"),

  events: {
      "keypress #new-todo": "createOnEnter",
      "keyup #new-todo": "showTooltip",
  },

  initialize: function() {
      _.bindAll(this, 'addOne', 'addAll', 'render');

      this.input = this.$("#new-todo");

      Todos.bind('add', this.addOne);
      Todos.bind('refresh', this.addAll);
      Todos.bind('all', this.render);

      Todos.fetch();
  },

  addOne: function(todo) {
      var view = new TodoView({
          model: todo
      }).render().el;
      this.$("#todo-list").grab(view);
      sortableTodos.addItems(view);
  },

  addAll: function() {
      Todos.each(this.addOne);
  },

  createOnEnter: function(e) {
      if (e.code != 13) return;
      Tasks.create({
          content: this.input.getProperty("value"),
          done: false
      });
      this.input.setProperty("value", "");
  },

  showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      tooltip.fade("out");

      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);

      if (this.input.getProperty("value") !== "" && this.input.getProperty("value") !== this.input.getProperty("placeholder")) {
          this.tooltipTimeout = setTimeout(function() {
              tooltip.fade("in");
          }, 1000);
      }
  },

  clearCompleted: function() {
      _.each(Tasks.done(), function(task) {
          task.clear();
      });
      return false;
  }
});

window.App = new AppView;