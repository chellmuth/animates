import Ember from 'ember';
import Point from '../utils/geometry';
import calculate from '../utils/bezier-curve';

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


function _wrapProperty(f, dependencies) {
  return f.property.apply(f, dependencies);
}

function _interactivePoints() {
  return [
    "controlPoint1.x", "controlPoint1.y",
    "endPoint1.x", "endPoint1.y",
    "endPoint2.x", "endPoint2.y"
  ];
}

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

  handlePoint1: _wrapProperty(function() {
    return calculate(this.get('endPoint1'), this.get('controlPoint1'), this.get('endPoint2'))[0];
  }, _interactivePoints()),

  handlePoint2: _wrapProperty(function() {
    return calculate(this.get('endPoint1'), this.get('controlPoint1'), this.get('endPoint2'))[1];
  }, _interactivePoints()),
});

var InterpolatedBezier = Ember.Object.extend({
  line1: null,
  line2: null,
  name: null,
  selector: null,

  interpolate: function(t) {
    var lineSelector = t === 0 ? "1" : "2";

    return ['endPoint1', 'handlePoint1', 'handlePoint2', 'endPoint2']
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

  generator: function() {
    return d3.svg.line()
      .interpolate('basis')
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });
  }.property(),

  draw: function(svg, t, style) {
    var line = this.get('generator');

    var lines = svg.selectAll('path').data(
      this.get('objects').map(function(line) { return line.interpolate(t); })
    );
    lines.enter().append('path');
    lines
      .style(styles[style].path)
      .attr('d', line);

    var circles = svg.selectAll('circle').data(
      this.get('objects')
        .map(function(line) {
          return line.interpolate(t).concat([
            line.get("line1.controlPoint1")
          ]);
        })
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

export default Ember.Route.extend({
  model: function() {
    return Container.create({
      objects: [
        // InterpolatedLine.create({
        //   line1: Line.create({
        //     endPoint1: Point.create({x:100, y:100}),
        //     endPoint2: Point.create({x:400, y:100}),
        //     selector: "model.objects.0.line1"
        //   }),
        //   line2: Line.create({
        //     endPoint1: Point.create({x:100, y:100}),
        //     endPoint2: Point.create({x:400, y:100}),
        //     selector: "model.objects.0.line2"
        //   }),
        //   name: "line 1",
        //   selector: "model.objects.0"
        // }),
        // InterpolatedLine.create({
        //   line1: Line.create({
        //     endPoint1: Point.create({x:100, y:200}),
        //     endPoint2: Point.create({x:400, y:200}),
        //     selector: "model.objects.1.line1"
        //   }),
        //   line2: Line.create({
        //     endPoint1: Point.create({x:100, y:200}),
        //     endPoint2: Point.create({x:400, y:200}),
        //     selector: "model.objects.1.line2"
        //   }),
        //   name: "line 2",
        //   selector: "model.objects.1"
        // }),
        InterpolatedBezier.create({
          line1: BezierLine.create({
            endPoint1: Point.create({x:100, y:100}),
            endPoint2: Point.create({x:100, y:200}),
            controlPoint1: Point.create({x:100, y:150}),
            controlPoint2: Point.create({x:20, y:150}),
            selector: "model.objects.0.line1"
          }),
          line2: BezierLine.create({
            endPoint1: Point.create({x:100, y:100}),
            endPoint2: Point.create({x:100, y:200}),
            controlPoint1: Point.create({x:100, y:150}),
            controlPoint2: Point.create({x:20, y:150}),
            selector: "model.objects.0.line2"
          }),
          name: "bezier 1",
          selector: "model.objects.0"
        }),
        // InterpolatedBezier.create({
        //   line1: BezierLine.create({
        //     endPoint1: Point.create({x:400, y:100}),
        //     endPoint2: Point.create({x:400, y:200}),
        //     controlPoint1: Point.create({x:400, y:150}),
        //     controlPoint2: Point.create({x:480, y:150}),
        //     selector: "model.objects.1.line1"
        //   }),
        //   line2: BezierLine.create({
        //     endPoint1: Point.create({x:400, y:100}),
        //     endPoint2: Point.create({x:400, y:200}),
        //     controlPoint1: Point.create({x:400, y:150}),
        //     controlPoint2: Point.create({x:480, y:150}),
        //     selector: "model.objects.1.line2"
        //   }),
        //   name: "bezier 2",
        //   selector: "model.objects.1"
        // })
      ]
    });
  }
});
