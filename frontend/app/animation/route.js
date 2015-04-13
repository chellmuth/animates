import Ember from 'ember';
import Point from '../utils/geometry';
import BezierCurve from '../utils/bezier-curve';

/* global d3 */

function interpolate(t, point1, point2, selector) {
  return Point.create({
    x: (point2.get('x') - point1.get('x')) * t + point1.get('x'),
    y: (point2.get('y') - point1.get('y')) * t + point1.get('y'),
    selector: selector,
  });
}

var styles = {
  "main": {
    "path": {
      fill: "none",
      stroke: "#333",
      "stroke-width": "2px"
    },
    "circle": {
      fill: "#333"
    }
  },
  "preview": {
    "path": {
      fill: "none",
      stroke: "#ddd",
      "stroke-width": "2px"
    },
    "circle": {
      fill: "#ddd"
    }
  }
};


var InterpolatedBezier = Ember.Object.extend({
  line1: null,
  line2: null,
  name: null,
  selector: null,

  interpolate: function(t) {
    var lineSelector = t === 0 ? "1" : "2";

    return ['endPoint1', 'handlePoint1', 'controlPoint1', 'handlePoint2', 'endPoint2']
      .map((pointSelector) => interpolate(
        t,
        this.get(`line1.${pointSelector}`),
        this.get(`line2.${pointSelector}`),
        `${this.selector}.line${lineSelector}.${pointSelector}`
      ));
  },

  move: function(pointSelector, lineSelector, x, y) {
    var line = this.get(lineSelector);
    if (pointSelector.indexOf("handlePoint") > -1) {
      var point = line.get("controlPoint1");
      var target = Point.create({x: x, y: y});
      var length = point.distance(target);
      line.set("handleScale", length);
    } else {
      line.set(`${pointSelector}.x`, x);
      line.set(`${pointSelector}.y`, y);
    }
  },

  generator: function() {
    return d3.svg.line()
      .interpolate('basis')
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });
  }.property(),

  draw: function(svg, t, style) {
    var results = [];

    var points = this.interpolate(t);
    var curves = [];
    for (var i = 0; i < points.length - 2; i += 2) {
      results.push(points.slice(i, i + 3));
    }

    var lines = svg.selectAll('path').data(results);
    lines.enter().append('path');
    lines
      .style(styles[style].path)
      .attr('d', this.get('generator'));

    var lineSelector = t === 0 ? "1" : "2";
    var circles = svg.selectAll('circle').data(
      this.interpolate(t).concat([
        interpolate(
          t,
          this.get("line1.controlPoint1"),
          this.get("line2.controlPoint1"),
          `${this.get("selector")}.line${lineSelector}.controlPoint1`
        )
      ])
      .reduce(function(acc, line) { return acc.concat(line); }, [])
    );

    circles.enter().append('circle');
    circles
      .style(styles[style].circle)
      .attr('r', 4)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  }
});

var InterpolatedLine = Ember.Object.extend({
  line1: null,
  line2: null,
  name: null,
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

  generator: function() {
    return d3.svg.line()
      .interpolate('basis')
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });
  }.property(),

  move: function(pointSelector, lineSelector, x, y) {
    var point = this.get(lineSelector).get(pointSelector);
    point.set("x", x);
    point.set("y", y);
  },

  draw: function(svg, t, style) {
    var points = this.interpolate(t);
    var lines = svg.selectAll('path').data([points]);
    lines.enter().append('path');
    lines
      .style(styles[style].path)
      .attr('d', this.get('generator'));

    var circles = svg.selectAll('circle').data(
      points.reduce(function(acc, line) { return acc.concat(line); }, [])
    );

    circles.enter().append('circle');
    circles
      .style(styles[style].circle)
      .attr('r', 4)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  }
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
  cycle: 1000,
  width: 500,
  height: 300,

  draw: function(svg, t, style) {
    svg.selectAll("*").remove();
    this.get('objects').forEach(function(object) {
      object.draw(svg.append("g"), t, style);
    });
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
          name: "line 1",
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
          name: "line 2",
          selector: "model.objects.1"
        }),
        InterpolatedBezier.create({
          line1: BezierCurve.create({
            endPoint1: Point.create({x:100, y:100}),
            endPoint2: Point.create({x:100, y:200}),
            controlPoint1: Point.create({x:160, y:150}),
            selector: "model.objects.2.line1"
          }),
          line2: BezierCurve.create({
            endPoint1: Point.create({x:100, y:100}),
            endPoint2: Point.create({x:100, y:200}),
            controlPoint1: Point.create({x:100, y:150}),
            selector: "model.objects.2.line2"
          }),
          name: "bezier 1",
          selector: "model.objects.2"
        }),
        InterpolatedBezier.create({
          line1: BezierCurve.create({
            endPoint1: Point.create({x:400, y:100}),
            endPoint2: Point.create({x:400, y:200}),
            controlPoint1: Point.create({x:400, y:150}),
            selector: "model.objects.3.line1"
          }),
          line2: BezierCurve.create({
            endPoint1: Point.create({x:400, y:100}),
            endPoint2: Point.create({x:400, y:200}),
            controlPoint1: Point.create({x:400, y:150}),
            selector: "model.objects.3.line2"
          }),
          name: "bezier 2",
          selector: "model.objects.3"
        })
      ]
    });
  }
});
