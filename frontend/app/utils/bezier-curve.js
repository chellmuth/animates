import Vector from './vector';

function makeHandles(point1, point2, point3, scale) {
  var tangent = Vector.createFromPoint(point1).subtract(Vector.createFromPoint(point3)).normal();

  return [
    Vector.createFromPoint(point2).add(tangent.scale(scale)),
    Vector.createFromPoint(point2).add(tangent.scale(-scale))
  ];
}

function wrapProperty(f, dependencies) {
  return f.property.apply(f, dependencies);
}

function interactivePoints() {
  return [
    "controlPoint1.x", "controlPoint1.y",
    "endPoint1.x", "endPoint1.y",
    "endPoint2.x", "endPoint2.y",
    "handleScale"
  ];
}

var BezierCurve = Ember.Object.extend({
  endPoint1: null,
  endPoint2: null,
  controlPoint1: null,
  handleScale: 30,
  selector: null,

  init: function() {
    this.set("endPoint1.selector", this.get("selector") + ".endPoint1");
    this.set("endPoint2.selector", this.get("selector") + ".endPoint2");
    this.set("controlPoint1.selector", this.get("selector") + ".controlPoint1");
  },

  handlePoint1: wrapProperty(function() {
    return makeHandles(this.get('endPoint1'), this.get('controlPoint1'), this.get('endPoint2'), this.get("handleScale"))[0];
  }, interactivePoints()),

  handlePoint2: wrapProperty(function() {
    return makeHandles(this.get('endPoint1'), this.get('controlPoint1'), this.get('endPoint2'), this.get("handleScale"))[1];
  }, interactivePoints()),
});


export default BezierCurve;
