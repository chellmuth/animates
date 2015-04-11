import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  _getElement: function(element) {
    return document.querySelector(`#${this.get("elementId")} ${element}`);
  },

  animateFrame: function(timestamp) {
    var element = this._getElement("svg");
    var svg = d3.select(element)
      .attr("viewBox", `0 0 ${this.get("model.width")} ${this.get("model.height")}`)
      .attr("width", "100%")
      .attr("height", element.getBoundingClientRect().width * this.get("model.height") / this.get("model.width"));

    svg.style('border', '1px solid black');

    var model = this.get("model");

    var cycle = this.get("model.cycle");
    var t = timestamp % cycle;
    var frames = model.get('frames');
    var frame = parseInt(t * (frames/cycle));

    model.draw(svg, frame/(frames - 1), "main");
    window.requestAnimationFrame(this.animateFrame.bind(this));
  },

  didInsertElement: function() {
    window.requestAnimationFrame(this.animateFrame.bind(this));
  },

});
