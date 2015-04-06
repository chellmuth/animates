import Ember from 'ember';
/* global d3 */


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
      .on("mousedown", function() {
        console.log('down');
        that.set("selected", d3.select(this));
      });

    svg
      .on("mousemove", function() {
        var selected = that.get("selected");
        if (selected !== null) {
          console.log(d3.mouse(this));
        }
      })
      .on("mouseup", function() {
        that.set("selected", null);
      })
      .on("mouseout", function() {
        that.set("selected", null);
      });
  },

  didInsertElement: function() {
    this.draw();
  }

});
