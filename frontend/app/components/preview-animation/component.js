import Ember from 'ember';
/* global d3 */

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

  animateFrame: function(timestamp) {
    var svg = d3.select('#' + this.get('elementId'));
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
