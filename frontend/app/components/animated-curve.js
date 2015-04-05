import Ember from 'ember';
/* global d3 */

var Point = Ember.Object.extend({});

var BezierLine = Ember.Object.extend({
  interpolate: function(t) {
    var controlPoint1 = this.get('controlPoint1');
    var controlPoint2 = this.get('controlPoint2');

    var interpolated = Point.create({
      x: (controlPoint2.get('x') - controlPoint1.get('x')) * t + controlPoint1.get('x'),
      y: (controlPoint2.get('y') - controlPoint1.get('y')) * t + controlPoint1.get('y')
    });

    return [ this.get('endPoint1'), interpolated, this.get('endPoint2') ];
  },

  generator: function() {
    return d3.svg.line()
      .interpolate('basis')
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y });
  }.property()
});

export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height'.w(),

  width: 600,
  height: 600,

  line: BezierLine.create({
    endPoint1: Point.create({x:56, y:215}),
    endPoint2: Point.create({x:504, y:474}),
    controlPoint1: Point.create({x:528, y:114}),
    controlPoint2: Point.create({x:190, y:400})
  }),

  draw: function(timestamp){
    var svg = d3.select('#' + this.get('elementId'));
    svg.style('border', '1px solid black');

    var cycle = 1600;
    var t = timestamp % cycle;
    var frames = 4;
    var frame = parseInt(t * (frames/cycle));

    var line = this.get('line').get('generator');

    var lines = svg.select('.lines').selectAll('path').data([this.get('line').interpolate(frame/frames)]);
    lines.enter().append('path');
    lines.style('stroke', 'black').style('fill', 'none').style('stroke-width', 2)
      .attr('d', line);

    var circles = svg.select('.circles').selectAll('circle').data(this.get('line').interpolate(frame/frames));
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
