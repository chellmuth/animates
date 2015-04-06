import Ember from 'ember';
/* global d3 */

var Point = Ember.Object.extend({
  x: null,
  y: null
});

export default Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height xmlns version'.w(),

  xmlns: "http://www.w3.org/2000/svg",
  version: "1.1",

  selected: null,

  width: function() {
    return this.get("model.width");
  }.property("model.width"),

  height: function() {
    return this.get("model.height");
  }.property("model.height"),

  draw: function() {
    var svg = d3.select(`#${this.get("elementId")}`);
    this.get("model").draw(svg, 0);

    var that = this;
    svg.selectAll("circle")
      .on("mouseover", function() {
        d3.select(this).attr("r", 6);
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 4);
      })
      .on("mousedown", function(d) {
        if (d.getWithDefault("selector", null) !== null) {
          that.set("selected", that.get(d.get("selector")));
        }
      });

    svg
      .on("mousemove", function() {
        var selected = that.get("selected");
        if (selected !== null) {
          selected.set("x", d3.mouse(this)[0]);
          selected.set("y", d3.mouse(this)[1]);
          window.requestAnimationFrame(function() {
            that.draw();
          });
        }
      })
      .on("mouseup", function() {
        that.set("selected", null);
      });
  },

  didInsertElement: function() {
    this.draw();
  }

});
