import Ember from 'ember';
/* global d3 */
/* global self */

export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height xmlns version'.w(),

  xmlns: "http://www.w3.org/2000/svg",
  version: "1.1",

  width: function() {
    return this.get("model.width") * this.get("model.frames");
  }.property("model.width"),

  height: function() {
    return this.get("model.height");
  }.property("model.height"),

  draw: function() {
    var svg = d3.select('#' + this.get('elementId'));
    svg.style('border', '1px solid black');
    svg.style('display', 'none');

    var frameCount = this.get("model.frames");
    var frameIterator = Array(frameCount);

    var that = this;
    var frames = svg.selectAll(".frame").data(frameIterator);
    frames.enter().append("g").classed("frame");
    frames
      .attr("transform", (d, i) => `translate(${i * this.get("model.width")} 0)`)
      .each(function(d, i) {
        that.get("model").draw(d3.select(this), i / frameCount);
      });
    frames.exit().remove();
  },

  exportPNG: function() {
    var svgElement = document.getElementById(this.get('elementId'));
    var rawSVG = svgElement.outerHTML;
    var svg = new Blob([rawSVG], {type:"image/svg+xml;charset=utf-8"});
    var domURL = self.URL || self.webkitURL || self;
    var url = domURL.createObjectURL(svg);
    var image = new Image();

    image.onerror = function() {
      alert('error!');
    };

    var that = this;
    image.onload = function() {
      var canvas = document.getElementById("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      var context = canvas.getContext("2d");

      context.drawImage(this, 0, 0);
      domURL.revokeObjectURL(url);
      that.sendAction('dataGenerated', canvas.toDataURL());
    };

    image.src = url;
  },

  didInsertElement: function() {
    this.draw();
    this.exportPNG();
  }
});
