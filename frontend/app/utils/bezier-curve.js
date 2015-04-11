import Vector from './vector';

function calculate(point1, point2, point3) {
  var tangent = Vector.createFromPoint(point1).subtract(Vector.createFromPoint(point3)).normal();
  var scale = 20;

  return [
    Vector.createFromPoint(point2).add(tangent.scale(scale)),
    Vector.createFromPoint(point2).add(tangent.scale(-scale))
  ];
}

export default calculate;
