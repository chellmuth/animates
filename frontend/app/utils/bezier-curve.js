import Vector from './vector';

function makeHandles(point1, point2, point3, scale) {
  var tangent = Vector.createFromPoint(point1).subtract(Vector.createFromPoint(point3)).normal();

  return [
    Vector.createFromPoint(point2).add(tangent.scale(scale)),
    Vector.createFromPoint(point2).add(tangent.scale(-scale))
  ];
}

export default makeHandles;
