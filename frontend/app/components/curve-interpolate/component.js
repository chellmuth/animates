import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height xmlns version'.w(),

  xmlns: "http://www.w3.org/2000/svg",
  version: "1.1",
  width: 500,
  height: 300,

  generator: function() {
    return d3.svg.line()
      .interpolate('basis')
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y });
  }.property(),

  drawInContainer: function(svg, t) {
    var line = this.get('generator');

    var lines = svg.select('.lines').selectAll('path').data(
      this.get('model').map(function(line) { return line.interpolate(t); })
    );
    lines.enter().append('path');
    lines.style('stroke', 'black').style('fill', 'none').style('stroke-width', 2)
      .attr('d', line);

    var circles = svg.select('.circles').selectAll('circle').data(
      this.get('model')
        .map(function(line) { return line.interpolate(t); })
        .reduce(function(acc, line) { return acc.concat(line); }, [])
    );

    circles.enter().append('circle');
    circles
      .attr('r', 4)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  },

  draw: function(timestamp) {
    var svg = d3.select('#' + this.get('elementId'));
    svg.style('border', '1px solid black');

    var cycle = 600;
    var t = timestamp % cycle;
    var frames = 6;
    var frame = parseInt(t * (frames/cycle));

    this.drawInContainer(svg.select(".half"), .5);
    this.drawInContainer(svg.select(".third"), .3);
  },


  exportPNG: function() {
    var rawSVG = document.getElementById(this.get('elementId')).outerHTML;
    var svg = new Blob([rawSVG], {type:"image/svg+xml;charset=utf-8"});
    var domURL = self.URL || self.webkitURL || self;
    var url = domURL.createObjectURL(svg);
    var image = new Image();

    image.onerror = function(event) {
      debugger;
    };

    var that = this;
    image.onload = function() {
      var context = document.getElementById("canvas").getContext("2d");

      context.drawImage(this, 0, 0);
      domURL.revokeObjectURL(url);
      that.sendAction('dataGenerated', canvas.toDataURL());
    };

    image.src = url;
  },

  didInsertElement: function() {
    this.draw()
    this.exportPNG();
  }
});
