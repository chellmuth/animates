import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  attributeBindings: 'width height'.w(),
  classNames: [ "col-md-6" ],

  selected: null,
  currentFrame: 0,

  width: function() {
    return this.get("model.width");
  }.property("model.width"),

  height: function() {
    return this.get("model.height");
  }.property("model.height"),

  frames: function() {
    var frameCount = this.get("model.frames");
    var result = [];
    for (var i = 0; i < frameCount; i++) {
      result.push(i+1);
    }
    return result;
  }.property("model.frames"),

  _getElement: function(element) {
    return document.querySelector(`#${this.get("elementId")} ${element}`);
  },

  _redraw: function() {
    window.requestAnimationFrame(() => this.draw());
  },

  draw: function() {
    var svg = d3.select(this._getElement("svg"));
    this.get("model").draw(svg, this.get("currentFrame") / this.get("frames.length"));

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
          that._redraw();
        }
      })
      .on("mouseup", function() {
        that.set("selected", null);
      });
  },

  didInsertElement: function() {
    this.draw();
  },

  actions: {
    selectFrame: function(index) {
      this.set("currentFrame", index);
      this._redraw();
    }
  }

});
