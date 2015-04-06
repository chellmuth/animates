import Ember from 'ember';
/* global d3 */
/* global self */

export default Ember.Component.extend({
  pngURL: null,
  isDisabled: null,

  width: function() {
    return this.get("model.width") * this.get("model.frames");
  }.property("model.width"),

  height: function() {
    return this.get("model.height");
  }.property("model.height"),

  _getElement: function(element) {
    return document.querySelector(`#${this.get("elementId")} ${element}`);
  },

  _draw: function() {
    var svg = d3.select(this._getElement("svg"));
    svg.style('display', 'none');

    var frameCount = this.get("model.frames");
    var frameIterator = new Array(frameCount);

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

  exportPNG: function(callback) {
    this._draw();

    var svgElement = this._getElement("svg");
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
      var canvas = that._getElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      var context = canvas.getContext("2d");

      context.drawImage(this, 0, 0);
      domURL.revokeObjectURL(url);
      callback(canvas.toDataURL());
    };

    image.src = url;
  },

  didInsertElement: function() {
    var svg = d3.select(this._getElement("svg"));
    svg.style('display', 'none');
  },

  actions: {
    download: function() {
      var that = this;

      this.set("isDisabled", true);
      this.exportPNG(function(URI) {
        var link = document.createElement("a");
        link.download = "spritesheet";
        link.href = URI;
        link.click();
        that.set("isDisabled", null);
      });
    }
  }
});
