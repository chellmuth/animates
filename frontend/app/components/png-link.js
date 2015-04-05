import Ember from 'ember';

export default Ember.Component.extend({
  link: function() {
    return "PNG LINK";
  }.property(),

  actions: {
    dataGenerated: function(dataURL) {
      console.log(dataURL);
    }
  }
});
