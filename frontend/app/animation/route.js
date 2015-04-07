import Ember from 'ember';
/* global d3 */

var Point = Ember.Object.extend({
  x: null,
  y: null,
  selector: null
});

var BezierLine = Ember.Object.extend({
  endPoint1: null,
  endPoint2: null,
  controlPoint1: null,
  controlPoint2: null,

  interpolate: function(t) {
    var controlPoint1 = this.get('controlPoint1');
    var controlPoint2 = this.get('controlPoint2');

    var interpolated = Point.create({
      x: (controlPoint2.get('x') - controlPoint1.get('x')) * t + controlPoint1.get('x'),
      y: (controlPoint2.get('y') - controlPoint1.get('y')) * t + controlPoint1.get('y'),
      selector:"model.objects.2.controlPoint" + (t === 0 ? "1" : "2")
    });

    return [ this.get('endPoint1'), interpolated, this.get('endPoint2') ];
  },
});

var Line = Ember.Object.extend({
  endPoint1: null,
  endPoint2: null,

  interpolate: function() {
    return [ this.get('endPoint1'), this.get('endPoint2') ];
  }
});

var Container = Ember.Object.extend({
  objects: null,
  frames: 6,
  width: 500,
  height: 300,

  generator: function() {
    return d3.svg.line()
      .interpolate('basis')
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });
  }.property(),

  draw: function(svg, t) {
    var line = this.get('generator');

    var lines = svg.selectAll('path').data(
      this.get('objects').map(function(line) { return line.interpolate(t); })
    );
    lines.enter().append('path');
    lines.style('stroke', 'black').style('fill', 'none').style('stroke-width', 2)
      .attr('d', line);

    var circles = svg.selectAll('circle').data(
      this.get('objects')
        .map(function(line) { return line.interpolate(t); })
        .reduce(function(acc, line) { return acc.concat(line); }, [])
    );

    circles.enter().append('circle');
    circles
      .attr('r', 4)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  }
});

export default Ember.Route.extend({
  model: function() {
    return Container.create({
      objects: [
        Line.create({
          endPoint1: Point.create({x:100, y:100, selector:"model.objects.0.endPoint1"}),
          endPoint2: Point.create({x:400, y:100, selector:"model.objects.0.endPoint2"})
        }),
        Line.create({
          endPoint1: Point.create({x:100, y:200, selector:"model.objects.1.endPoint1"}),
          endPoint2: Point.create({x:400, y:200, selector:"model.objects.1.endPoint2"})
        }),
        BezierLine.create({
          endPoint1: Point.create({x:100, y:100, selector:"model.objects.2.endPoint1"}),
          endPoint2: Point.create({x:100, y:200, selector:"model.objects.2.endPoint2"}),
          controlPoint1: Point.create({x:100, y:150}),
          controlPoint2: Point.create({x:20, y:150})
        }),
        BezierLine.create({
          endPoint1: Point.create({x:400, y:100, selector:"model.objects.3.endPoint1"}),
          endPoint2: Point.create({x:400, y:200, selector:"model.objects.3.endPoint2"}),
          controlPoint1: Point.create({x:400, y:150}),
          controlPoint2: Point.create({x:480, y:150})
        })
      ]
    });
  }
});
