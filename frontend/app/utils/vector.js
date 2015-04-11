import Ember from 'ember';

var Vector = Ember.Object.extend({
  x: null,
  y: null,

  normal: function() {
    var x = this.get("x");
    var y = this.get("y");
    var length = Math.sqrt(x * x + y * y);
    return Vector.create({x: x/length, y: y/length});
  },

  add: function(other) {
    return Vector.create({
      x: this.get("x") + other.get("x"),
      y: this.get("y") + other.get("y")
    });
  },

  subtract: function(other) {
    return this.add(other.scale(-1));
  },

  scale: function(s) {
    return Vector.create({
      x: this.get("x") * s,
      y: this.get("y") * s
    });
  }
});

Vector.reopenClass({
  createFromPoint: function(point) {
    return Vector.create({x: point.get("x"), y: point.get("y") });
  }
});

export default Vector;
