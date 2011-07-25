window.Message = Backbone.Model.extend({});
window.MessageList = Backbone.Collection.extend({
  model: Message,
  localStorage: new Store('messages')
});
window.MessageView = Backbone.View.extend({
  tagName: 'li',
  template : _.template('<%= content %>'),
  
  initialize: function() {
    _.bindAll(this, 'render','addOne','addAll');
    this.model.bind('change', this.render);
    this.model.bind('reset',this.addAll);
    this.model.bind('add', this.addOne);
    this.model.view = this;
  },
  addOne: function(message) {
    var view = new MessageView({model: message});
    $('#message-list').prepend(view.render().el);
  },
  addAll: function() {
    this.messages.each(this.addOne);
  },
  
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }
});

window.MailBox = Backbone.Model.extend({  
  initialize: function() {
    _.bindAll(this, 'addOne', 'addAll');
    this.set({kind: 'MailBox'});
    this.messages = new MessageList;
    this.messages.fetch();
  }
});

window.mailbox = new MailBox; // just one new mailbox

window.MailBoxView = Backbone.View.extend({
  el: $("#app"),
  events: {
    "keypress #new-message": "saveOnEnter"
  },
  initialize: function() {
    this.input = this.$("#new-message")[0];
  },
  saveOnEnter: function(e) {
    if(e.keyCode != 13) return;
    mailbox.messages.create(new Message({content: this.input.value}));
    this.input.value = '';
  }
});

mailboxView = new MailBoxView;
