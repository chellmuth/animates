import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height xmlns version'.w(),

  xmlns: "http://www.w3.org/2000/svg",
  version: "1.1",
  width: function() {
    return this.get("model.width");
  }.property("model.width"),

  height: function() {
    return this.get("model.height");
  }.property("model.height"),

  draw: function() {
    var svg = d3.select(`#${this.get("elementId")}`);
    this.get("model").draw(svg, 0);
  },

  didInsertElement: function() {
    this.draw();
  }

});
