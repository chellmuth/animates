import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  attributeBindings: 'width height'.w(),
  classNames: [ "col-md-6" ],

  width: function() {
    return this.get("model.width");
  }.property("model.width"),

  height: function() {
    return this.get("model.height");
  }.property("model.height"),

  _getElement: function(element) {
    return document.querySelector(`#${this.get("elementId")} ${element}`);
  },

  animateFrame: function(timestamp) {
    var svg = d3.select(this._getElement("svg"));
    svg.style('border', '1px solid black');

    var model = this.get('model');

    var cycle = 600;
    var t = timestamp % cycle;
    var frames = model.get('frames');
    var frame = parseInt(t * (frames/cycle));

    model.draw(svg, frame/frames);
    window.requestAnimationFrame(this.animateFrame.bind(this));
  },

  didInsertElement: function() {
    window.requestAnimationFrame(this.animateFrame.bind(this));
  }
});
