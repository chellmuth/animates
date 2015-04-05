import Ember from 'ember';
/* global d3 */

var Point = Ember.Object.extend({
  x: null,
  y: null
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
      y: (controlPoint2.get('y') - controlPoint1.get('y')) * t + controlPoint1.get('y')
    });

    return [ this.get('endPoint1'), interpolated, this.get('endPoint2') ];
  }
});

var Line = Ember.Object.extend({
  endPoint1: null,
  endPoint2: null,

  interpolate: function(t) {
    return [ this.get('endPoint1'), this.get('endPoint2') ];
  }
});

export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height xmlns version'.w(),

  xmlns: "http://www.w3.org/2000/svg",
  version: "1.1",
  width: 500,
  height: 300,

  lines: [
    BezierLine.create({
      endPoint1: Point.create({x:100, y:100}),
      endPoint2: Point.create({x:100, y:200}),
      controlPoint1: Point.create({x:100, y:150}),
      controlPoint2: Point.create({x:60, y:150})
    }),
    BezierLine.create({
      endPoint1: Point.create({x:400, y:100}),
      endPoint2: Point.create({x:400, y:200}),
      controlPoint1: Point.create({x:400, y:150}),
      controlPoint2: Point.create({x:440, y:150})
    }),
    Line.create({
      endPoint1: Point.create({x:100, y:100}),
      endPoint2: Point.create({x:400, y:100})
    }),
    Line.create({
      endPoint1: Point.create({x:100, y:200}),
      endPoint2: Point.create({x:400, y:200})
    })

  ],

  generator: function() {
    return d3.svg.line()
      .interpolate('basis')
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y });
  }.property(),

  draw: function(timestamp) {
    var svg = d3.select('#' + this.get('elementId'));
    svg.style('border', '1px solid black');

    var cycle = 600;
    var t = timestamp % cycle;
    var frames = 4;
    var frame = parseInt(t * (frames/cycle));

    var line = this.get('generator');

    var lines = svg.select('.lines').selectAll('path').data(
      this.get('lines').map(function(line) { return line.interpolate(frame/frames); })
    );
    lines.enter().append('path');
    lines.style('stroke', 'black').style('fill', 'none').style('stroke-width', 2)
      .attr('d', line);

    var circles = svg.select('.circles').selectAll('circle').data(
      this.get('lines')
        .map(function(line) { return line.interpolate(frame/frames); })
        .reduce(function(acc, line) { return acc.concat(line); }, [])
    );

    circles.enter().append('circle');
    circles
      .attr('r', 4)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);

    window.requestAnimationFrame(this.draw.bind(this));
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

    image.onload = function() {
      var context = document.getElementById("canvas").getContext("2d");

      context.drawImage(this, 0, 0);
      domURL.revokeObjectURL(url);
      console.log(canvas.toDataURL());
    };

    image.src = url;
  },

  didInsertElement: function() {
    window.requestAnimationFrame(this.draw.bind(this));
    setTimeout(this.exportPNG.bind(this), 400);
  }
});
