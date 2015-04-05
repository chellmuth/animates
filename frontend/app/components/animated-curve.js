import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height'.w(),

  width: 600,
  height: 600,

  draw: function(timestamp){
    var svg = d3.select('#' + this.get('elementId'));
    svg.style('border', '1px solid black');

    var width = 600;
    var height = 500;

    var endPoints = [ {x:56, y:215}, {x:504, y:474} ];

    var cycle = 1600;
    var t = timestamp % cycle;
    var frames = 16 * 2;
    var frame = parseInt(t * (frames/cycle));

    var controlPoints = [{x:528, y:114}, {x:90, y:400}];
    var controlPoint = {
      x: (controlPoints[1].x - controlPoints[0].x) * (frame/frames) + controlPoints[0].x,
      y: (controlPoints[1].y - controlPoints[0].y) * (frame/frames) + controlPoints[0].y
    };

    var line = d3.svg.line()
      .interpolate('basis')
      .x(function(d, i) { return d.x; })
      .y(function(d) { return d.y });

    var points = [endPoints[0], controlPoint, endPoints[1]]

    var lines = svg.select('.lines').selectAll('path').data([points]);
    lines.enter().append('path');
    lines.style('stroke', 'black').style('fill', 'none').style('stroke-width', 2)
      .attr('d', line);

    var circles = svg.select('.circles').selectAll('circle').data(points);
    circles.enter().append('circle');
    circles
      .attr('r', 4)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);

    window.requestAnimationFrame(this.draw.bind(this));
  },

  didInsertElement: function(){
    window.requestAnimationFrame(this.draw.bind(this));
  }
});
