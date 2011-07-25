window.Message = Backbone.Model.extend({});
window.MessageCollection = Backbone.Collection.extend({
  model: Message,
  localStorage: new Store('messages')
});
window.MessageView = Backbone.View.extend({
  tagName: 'li', //the kind of tag that will be wrapping our data
  template : _.template('<%= content %>'), //template for our data
  
  initialize: function() {
    _.bindAll(this, 'render'); //make render accessible to outsiders
    this.model.bind('change', this.render); //on change to model, render it
    this.model.view = this;
  },
  
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }
});

window.MailBox = Backbone.Model.extend({  
  initialize: function() {
    _.bindAll(this, 'addOne', 'addAll');

    //And now the MAGIC! We just create a new Collection inside the model. Easy, huh?
    this.messages = new MessageCollection;
    this.messages.bind('reset',this.addAll); // reset data? add it all again
    this.messages.bind('add', this.addOne); //new message added? run this.addOne
    
    this.messages.fetch(); //get all of our messages loaded
  },
  addOne: function(message) {
    var view = new MessageView({model: message});
    $('#message-list').prepend(view.render().el);
  },
  addAll: function() {
    this.messages.each(this.addOne);
  }
});

window.mailbox = new MailBox; // just one new mailbox

window.MailBoxView = Backbone.View.extend({
  el: $("#app"),
  events: {
    "keypress #new-message": "saveOnEnter" //press enter in the input, make a new message
  },
  initialize: function() {
    this.input = this.$("#new-message")[0]; //$ gives us back an array, get the first selector
  },
  saveOnEnter: function(e) {
    if(e.keyCode != 13) return; // keyCode 13 is the enter key
    // now throw in a new message into the messages collection in the mailbox
    mailbox.messages.create(new Message({content: this.input.value}));
    this.input.value = ''; //clear that textbox
  }
});

mailboxView = new MailBoxView; //a new mailbox view. more like an interface
