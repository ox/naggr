window.ContactPoint = Backbone.Model.extend({});
window.ContactPointCollection = Backbone.Collection.extend({
  model: ContactPoint,
  localStorage: new Store('contact_point')
});

window.contact_points = new ContactPointCollection;

window.ContactPointView = Backbone.View.extend({
  tagName: 'li',
  
  initialize: function() {
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
    this.model.view = this;
  },
  
  render: function() {
    $(this.el).html(_.template('<%=content%>',this.model.toJSON()));
    return this;
  }
});