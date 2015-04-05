import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height xmlns version'.w(),

  xmlns: "http://www.w3.org/2000/svg",
  version: "1.1",
  width: 500,
  height: 300,

  draw: function(timestamp) {
    var svg = d3.select('#' + this.get('elementId'));

    var cycle = 600;
    var t = timestamp % cycle;
    var frames = 6;
    var frame = parseInt(t * (frames/cycle));

    this.get('model').draw(svg, frame/frames);
    window.requestAnimationFrame(this.draw.bind(this));
  },

  didInsertElement: function() {
    window.requestAnimationFrame(this.draw.bind(this));
  }
});
