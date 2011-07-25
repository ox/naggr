window.Task = Backbone.Model.extend({                
  clear: function() {
    this.destroy();
    $(this.view.el).dispose();
  }
});
window.TaskList = Backbone.Collection.extend({
  model:Task, 
  localStorage: new Store("tasks"),
  nextOrder: function() {
    if(!this.length) return 1;
    return this.last().get('order') + 1; //length can change. The last order can't
  }
});

window.TaskView = Backbone.View.extend({
  tagName: 'li',
  
  template : _.template('<div class="task"><%= content %></div>'),
  
  events: {
    "dblclick .task" : 'beginEditing',
    'keypress #ced': "saveOnEnter"
  },
  
  initialize: function() {
    _.bindAll(this, 'beginEditing', 'saveOnEnter', 'render');
    this.model.bind('change', this.render);
    this.model.view = this;
  },
  
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  },
  
  beginEditing: function() {
    console.log('editing ');
    this.$(".task").html('<input class="task" type="text" id="ced"/>');
    this.$("#ced")[0].focus();
    this.$("#ced")[0].value = this.model.get('content');
  },
  
  saveOnEnter: function(e) {
    if(e.keyCode != 13) return;
    this.model.set({'content': this.$("#ced")[0].value}).save();
    $("#ced").blur();
    this.$(".task").html(this.model.get('content'));
  }
});
