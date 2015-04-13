import Ember from 'ember';

var Point = Ember.Object.extend({
  x: null,
  y: null,
  selector: null,

  distance: function(other) {
    return Math.sqrt(
      Math.pow(this.get("x") - other.get("x"), 2)
      + Math.pow(this.get("y") - other.get("y"), 2)
    );
  }
});

export default Point;
