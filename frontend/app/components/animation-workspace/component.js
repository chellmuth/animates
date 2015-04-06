import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  attributeBindings: 'width height'.w(),

  selected: null,

  width: function() {
    return this.get("model.width");
  }.property("model.width"),

  height: function() {
    return this.get("model.height");
  }.property("model.height"),

  _getElement: function(element) {
    return document.querySelector(`#${this.get("elementId")} ${element}`);
  },

  draw: function() {
    var svg = d3.select(this._getElement("svg"));
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
