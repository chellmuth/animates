import Ember from 'ember';
/* global d3 */

function interpolate(t, point1, point2, selector) {
  return Point.create({
    x: (point2.get('x') - point1.get('x')) * t + point1.get('x'),
    y: (point2.get('y') - point1.get('y')) * t + point1.get('y'),
    selector: selector,
  });
}

var Point = Ember.Object.extend({
  x: null,
  y: null,
  selector: null,

});

var BezierLine = Ember.Object.extend({
  endPoint1: null,
  endPoint2: null,
  controlPoint1: null,
  controlPoint2: null,
  selector: null,

  init: function() {
    this.set("endPoint1.selector", this.get("selector") + ".endPoint1");
    this.set("endPoint2.selector", this.get("selector") + ".endPoint2");
  },

  interpolate: function(t) {
    var controlPoint1 = this.get('controlPoint1');
    var controlPoint2 = this.get('controlPoint2');

    var controlPointSelector = this.get("selector") + ".controlPoint" + (t === 0 ? "1" : "2");
    var controlPointInterpolated = interpolate(t, controlPoint1, controlPoint2, controlPointSelector);

    return [ this.get('endPoint1'), controlPointInterpolated, this.get('endPoint2') ];
  },
});

var InterpolatedBezier = Ember.Object.extend({
  line1: null,
  line2: null,
  selector: null,

  interpolate: function(t) {
    var lineSelector = t === 0 ? "1" : "2";

    return ['endPoint1', 'controlPoint1', 'endPoint2']
      .map((pointSelector) => interpolate(
        t,
        this.get(`line1.${pointSelector}`),
        this.get(`line2.${pointSelector}`),
        `${this.selector}.line${lineSelector}.${pointSelector}`
      ));
  },
});

var InterpolatedLine = Ember.Object.extend({
  line1: null,
  line2: null,
  selector: null,

  interpolate: function(t) {
    var lineSelector = t === 0 ? "1" : "2";

    return ['endPoint1', 'endPoint2']
      .map((pointSelector) => interpolate(
        t,
        this.get(`line1.${pointSelector}`),
        this.get(`line2.${pointSelector}`),
        `${this.selector}.line${lineSelector}.${pointSelector}`
      ));
  },
});

var Line = Ember.Object.extend({
  endPoint1: null,
  endPoint2: null,
  selector: null,

  init: function() {
    this.set("endPoint1.selector", this.get("selector") + ".endPoint1");
    this.set("endPoint2.selector", this.get("selector") + ".endPoint2");
  },

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
        InterpolatedLine.create({
          line1: Line.create({
            endPoint1: Point.create({x:100, y:100}),
            endPoint2: Point.create({x:400, y:100}),
            selector: "model.objects.0.line1"
          }),
          line2: Line.create({
            endPoint1: Point.create({x:100, y:100}),
            endPoint2: Point.create({x:400, y:100}),
            selector: "model.objects.0.line2"
          }),
          selector: "model.objects.0"
        }),
        InterpolatedLine.create({
          line1: Line.create({
            endPoint1: Point.create({x:100, y:200}),
            endPoint2: Point.create({x:400, y:200}),
            selector: "model.objects.1.line1"
          }),
          line2: Line.create({
            endPoint1: Point.create({x:100, y:200}),
            endPoint2: Point.create({x:400, y:200}),
            selector: "model.objects.1.line2"
          }),
          selector: "model.objects.1"
        }),
        InterpolatedBezier.create({
          line1: BezierLine.create({
            endPoint1: Point.create({x:100, y:100}),
            endPoint2: Point.create({x:100, y:200}),
            controlPoint1: Point.create({x:100, y:150}),
            controlPoint2: Point.create({x:20, y:150}),
            selector: "model.objects.2.line1"
          }),
          line2: BezierLine.create({
            endPoint1: Point.create({x:100, y:100}),
            endPoint2: Point.create({x:100, y:200}),
            controlPoint1: Point.create({x:100, y:150}),
            controlPoint2: Point.create({x:20, y:150}),
            selector: "model.objects.2.line2"
          }),
          selector: "model.objects.2"
        }),
        InterpolatedBezier.create({
          line1: BezierLine.create({
            endPoint1: Point.create({x:400, y:100}),
            endPoint2: Point.create({x:400, y:200}),
            controlPoint1: Point.create({x:400, y:150}),
            controlPoint2: Point.create({x:480, y:150}),
            selector: "model.objects.3.line1"
          }),
          line2: BezierLine.create({
            endPoint1: Point.create({x:400, y:100}),
            endPoint2: Point.create({x:400, y:200}),
            controlPoint1: Point.create({x:400, y:150}),
            controlPoint2: Point.create({x:480, y:150}),
            selector: "model.objects.3.line2"
          }),
          selector: "model.objects.3"
        })
      ]
    });
  }
});
