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

    var main = svg.select("g.mainFrame");
    this.get("model").draw(main, this.get("currentFrame") / (this.get("frames.length") - 1));

    var that = this;
    svg.selectAll("g.frame").each(function(d, i) {
      if (i === that.get("currentFrame")) { return; }
      that.get("model").draw(d3.select(this), i / (that.get("frames.length") - 1));
    })

    main.selectAll("circle")
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
    var svg = d3.select(this._getElement("svg"));
    for (var i = 1; i < this.get("frames.length"); i++) {
      svg.append("g").classed("frame", true);
    }
    svg.append("g").classed({mainFrame: true});
    this.draw();
  },

  actions: {
    selectFrame: function(index) {
      this.set("currentFrame", index);
      this._redraw();
    }
  }

});
