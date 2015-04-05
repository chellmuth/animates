import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height xmlns version'.w(),

  xmlns: "http://www.w3.org/2000/svg",
  version: "1.1",
  width: 500,
  height: 300,

  animateFrame: function(timestamp) {
    var svg = d3.select('#' + this.get('elementId'));

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
