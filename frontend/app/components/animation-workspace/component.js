import Ember from 'ember';
/* global d3 */

export default Ember.Component.extend({
  attributeBindings: 'width height'.w(),
  classNames: [ "col-md-6" ],

  selector: null,
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
    this.get("model").draw(main, this.get("currentFrame") / (this.get("frames.length") - 1), "main");

    var that = this;
    svg.selectAll("g.previewFrame").each(function(d, i) {
      if (i === that.get("currentFrame")) {
        d3.select(this).selectAll("*").remove();
        return;
      }
      that.get("model").draw(d3.select(this), i / (that.get("frames.length") - 1), "preview");
    });

    main.selectAll("circle")
      .on("mouseover", function() {
        d3.select(this).attr("r", 6);
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 4);
      })
      .on("mousedown", function(d) {
        var selector = d.getWithDefault("selector", null);
        if (selector !== null) {
          that.set("selector", selector);
        }
      });

    main.selectAll("path")
      .on("mouseover", function(d) {
        d3.select(this).style("stroke-width", "4px");
      })
      .on("mouseout", function() {
        d3.select(this).style("stroke-width", "2px");
      });

    svg
      .on("mousemove", function() {
        var selector = that.get("selector");
        if (selector !== null) {
          var pieces = selector.split(".");
          var point = pieces.pop();
          var line = pieces.pop();
          var parent = pieces.join(".");

          var selected = that.get(parent);
          selected.move(point, line, d3.mouse(this)[0], d3.mouse(this)[1]);

          that._redraw();
        }
      })
      .on("mouseup", function() {
        that.set("selector", null);
      });
  },

  didInsertElement: function() {
    var svg = d3.select(this._getElement("svg"));
    for (var i = 0; i < this.get("frames.length"); i++) {
      svg.append("g").classed("previewFrame", true);
    }
    svg.append("g").classed({mainFrame: true});
    this.draw();

    this.$(".frame-selector label:eq(0)").addClass("active");
  },

  actions: {
    selectFrame: function(index) {
      this.set("currentFrame", index);
      this._redraw();
    }
  }

});
